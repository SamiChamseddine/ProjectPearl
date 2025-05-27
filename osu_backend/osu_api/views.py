from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging
from .models import Beatmap, BeatmapSet
from datetime import datetime, timezone, timedelta
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)
User = get_user_model()

class BeatmapSearchView(APIView):
    DEFAULT_LIMIT = 20
    MAX_LIMIT = 100

    def get(self, request):
        try:
            results, next_cursor = self._process_search(request.query_params)
            return Response(
                {"results": results, "cursor": next_cursor, "count": len(results)}
            )
        except Exception as e:
            logger.error(f"Search failed: {str(e)}", exc_info=True)
            return Response(
                {"error": "Server error while processing your request"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def _process_search(self, params):
        """Optimized search pipeline that guarantees page size of beatmapsets"""
        limit = self._get_limit(params)
    
        # Build combined query with proper ordering
        base_query = self._build_combined_query(params)
    
        # Apply cursor pagination
        if cursor := params.get("cursor"):
            base_query = self._apply_cursor_pagination(base_query, cursor)
    
        # Get distinct beatmapset IDs with proper ordering
        beatmapset_ids = (
            base_query.order_by("-beatmapset__ranked_date", "-beatmapset__id")
                     .values_list('beatmapset_id', flat=True)
                     .distinct()
        )
    
        # Apply limit + 1 to check for more pages
        beatmapset_ids = list(beatmapset_ids[:limit + 1])

        # Determine if there are more results
        has_more = len(beatmapset_ids) > limit
        if has_more:
            beatmapset_ids = beatmapset_ids[:limit]
    
        # Get the actual beatmaps for these sets (one per set) with proper ordering
        beatmaps = (
            Beatmap.objects
            .filter(beatmapset_id__in=beatmapset_ids)
            .select_related('beatmapset')
            .order_by("-beatmapset__ranked_date", "-beatmapset__id", "-difficulty_rating")
        )
    
        # Format results
        results = [self._format_beatmap(b) for b in beatmaps]
    
        # Calculate next cursor using the last beatmapset
        next_cursor = None
        if has_more and beatmapset_ids:
            last_set = BeatmapSet.objects.get(id=beatmapset_ids[-1])
            next_cursor = f"{last_set.ranked_date.isoformat()}|{last_set.id}"
    
        return results, next_cursor

    def _build_combined_query(self, params):
        """Build a query that handles all filters efficiently"""
        query = Beatmap.objects.select_related("beatmapset")

        # Base filter - only ranked maps
        query = query.filter(beatmapset__ranked_date__isnull=False)

        # Apply all beatmapset filters
        query = self._apply_beatmapset_filters(query, params)

        # Apply all beatmap filters
        query = self._apply_beatmap_filters(query, params)

        # Default ordering
        return query.order_by(
            "-beatmapset__ranked_date", "-beatmapset__id", "-difficulty_rating"
        )

    def _apply_beatmapset_filters(self, query, params):
        """Apply filters that affect the beatmapset"""
        # Status filter
        if status_values := params.get("status"):
            status_list = [s.strip() for s in status_values.split(",") if s.strip()]
            if status_list:
                query = query.filter(beatmapset__status__in=status_list)

        # Text filters
        text_fields = ["creator", "artist", "title"]
        for field in text_fields:
            if value := params.get(field):
                terms = [term.strip() for term in value.split() if term.strip()]
                for term in terms:
                    query = query.filter(**{f"beatmapset__{field}__icontains": term})

        # Date filters
        date_filters = [
            ("created_after", "beatmapset__ranked_date__gte"),
            ("created_before", "beatmapset__ranked_date__lte"),
        ]
        for param_key, q_key in date_filters:
            if date_str := params.get(param_key):
                try:
                    date_val = datetime.strptime(date_str, "%Y-%m-%d").replace(
                        tzinfo=timezone.utc
                    )
                    if param_key == "created_before":
                        date_val += timedelta(days=1)
                    query = query.filter(**{q_key: date_val})
                except (ValueError, TypeError) as e:
                    logger.warning(f"Invalid {param_key} date: {date_str} - {str(e)}")

        # Numeric beatmapset filters
        range_filters = [
            ("favouritesMin", "favouritesMax", "beatmapset__favourite_count"),
            ("playCountMin", "playCountMax", "beatmapset__play_count"),
        ]
        for min_key, max_key, field in range_filters:
            if min_val := params.get(min_key):
                try:
                    query = query.filter(**{f"{field}__gte": float(min_val)})
                except (ValueError, TypeError):
                    logger.warning(f"Invalid {min_key} value: {min_val}")
            if max_val := params.get(max_key):
                try:
                    query = query.filter(**{f"{field}__lte": float(max_val)})
                except (ValueError, TypeError):
                    logger.warning(f"Invalid {max_key} value: {max_val}")

        # Tag filtering
        if tags := params.get("tags"):
            tag_list = [tag.strip().lower() for tag in tags.split(",") if tag.strip()]
            for tag in tag_list:
                spaced_tag = " ".join(tag)  # Convert "japanese" to "j a p a n e s e"
                query = query.filter(beatmapset__tags__icontains=spaced_tag)

        return query

    def _apply_beatmap_filters(self, query, params):
        """Apply filters that affect individual beatmaps"""
        # Difficulty filters
        range_filters = [
            ("arMin", "arMax", "ar"),
            ("csMin", "csMax", "cs"),
            ("starsMin", "starsMax", "difficulty_rating"),
            ("lengthMin", "lengthMax", "total_length"),
            ("bpmMin", "bpmMax", "bpm"),
        ]
        for min_key, max_key, field in range_filters:
            if min_val := params.get(min_key):
                try:
                    query = query.filter(**{f"{field}__gte": float(min_val)})
                except (ValueError, TypeError):
                    logger.warning(f"Invalid {min_key} value: {min_val}")
            if max_val := params.get(max_key):
                try:
                    query = query.filter(**{f"{field}__lte": float(max_val)})
                except (ValueError, TypeError):
                    logger.warning(f"Invalid {max_key} value: {max_val}")

        # Mode filter
        if mode_values := params.get("mode"):
            valid_modes = {"0", "1", "2", "3"}
            modes = [m for m in mode_values.split(",") if m in valid_modes]
            if modes:
                query = query.filter(mode__in=modes)

        return query

    def _apply_cursor_pagination(self, query, cursor):
        """Apply cursor-based pagination to the query"""
        try:
            cursor_date_str, cursor_id = cursor.split("|")
            cursor_date = datetime.fromisoformat(cursor_date_str).replace(
                tzinfo=timezone.utc
            )
            return query.filter(
                Q(beatmapset__ranked_date__lt=cursor_date)
                | (
                    Q(beatmapset__ranked_date=cursor_date)
                    & Q(beatmapset__id__lt=int(cursor_id))
                )
            )
        except (ValueError, IndexError) as e:
            logger.warning(f"Invalid cursor format: {cursor} - {str(e)}")
            return query

    def _get_limit(self, params):
        """Get and validate the limit parameter"""
        try:
            limit = int(params.get("limit", self.DEFAULT_LIMIT))
            return min(max(limit, 1), self.MAX_LIMIT)  # Ensure between 1 and MAX_LIMIT
        except (ValueError, TypeError):
            return self.DEFAULT_LIMIT

    def _format_beatmap(self, beatmap):
        """Format a single beatmap result"""
        return {
            "id": beatmap.id,
            "beatmapset_id": beatmap.beatmapset_id,
            "version": beatmap.version,
            "difficulty_rating": float(beatmap.difficulty_rating),
            "ar": float(beatmap.ar),
            "cs": float(beatmap.cs),
            "bpm": float(beatmap.bpm),
            "total_length": beatmap.total_length,
            "mode": beatmap.mode,
            "status": beatmap.status,
            "title": beatmap.beatmapset.title,
            "artist": beatmap.beatmapset.artist,
            "creator": beatmap.beatmapset.creator,
            "favourite_count": beatmap.beatmapset.favourite_count,
            "play_count": int(beatmap.beatmapset.play_count or 0),
            "ranked_date": beatmap.beatmapset.ranked_date,
            "tags": beatmap.beatmapset.tags,
            "accuracy": float(beatmap.accuracy),
            "max_combo": beatmap.max_combo,
        }

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email', '')

        if not username or not password:
            return Response(
                {'error': 'Username and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(
            username=username,
            password=password,
            email=email
        )

        return Response(
            {'message': 'User created successfully'},
            status=status.HTTP_201_CREATED
        )

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'email': user.email
        })
