import os
import psycopg2
import requests
import logging
import json
from datetime import datetime, timezone, timedelta
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('beatmap_import.log'),
        logging.StreamHandler()
    ]
)

class OsuBeatmapImporter:
    def __init__(self):
        # Database connection
        self.db_conn = psycopg2.connect(
            dbname=os.getenv('DB_NAME', 'osu_beatmaps'),
            user=os.getenv('DB_USER', 'osu_user'),
            password=os.getenv('DB_PASSWORD'),
            host=os.getenv('DB_HOST', 'localhost')
        )
        self.cursor = self.db_conn.cursor()
        
        # Osu API credentials
        self.client_id = os.getenv('OSU_CLIENT_ID')
        self.client_secret = os.getenv('OSU_CLIENT_SECRET')
        self.token = None
        self.token_expires = None
        
        # Stats
        self.total_beatmapsets = 0
        self.total_beatmaps = 0
        self.last_ranked_date = None

    def get_osu_token(self):
        """Get or refresh OAuth token"""
        if self.token and datetime.now(timezone.utc) < self.token_expires:
            return self.token
            
        try:
            response = requests.post(
                'https://osu.ppy.sh/oauth/token',
                json={
                    'client_id': self.client_id,
                    'client_secret': self.client_secret,
                    'grant_type': 'client_credentials',
                    'scope': 'public'
                },
                headers={
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                timeout=10
            )
            response.raise_for_status()
            data = response.json()
            self.token = data['access_token']
            self.token_expires = datetime.now(timezone.utc) + timedelta(seconds=data['expires_in'] - 60)
            return self.token
        except Exception as e:
            logging.error(f"Failed to get osu! token: {str(e)}")
            raise

    def create_tables(self):
        """Ensure tables exist (same as your schema)"""
        with self.db_conn.cursor() as cursor:
            # Your table creation SQL here (same as previous step)
            pass

    def fetch_beatmapsets(self, cursor=None):
        """Fetch beatmapsets from osu! API"""
        url = 'https://osu.ppy.sh/api/v2/beatmapsets/search'
        params = {
            'sort': 'ranked_desc',
            'limit': 100,
            'mode': 'osu',# Max allowed per request
        }
        if cursor:
            for key, value in cursor.items():
                params[f'cursor[{key}]'] = value

        headers = {
            'Authorization': f'Bearer {self.get_osu_token()}'
        }

        try:
            response = requests.get(url, params=params, headers=headers, timeout=15)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logging.error(f"API request failed: {str(e)}")
            return None

    def process_beatmapset(self, beatmapset):
        """Store a single beatmapset and its beatmaps"""
        try:
            # Insert beatmapset
            self.cursor.execute("""
                INSERT INTO beatmapsets (
                    id, artist, artist_unicode, creator, favourite_count, genre_id, 
                    language_id, nsfw, play_count, source, status, title, title_unicode,
                    user_id, video, bpm, discussion_enabled, discussion_locked, 
                    is_scoreable, last_updated, ranked_date, submitted_date, storyboard,
                    rating, tags, covers, availability, nominations_summary
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                ) ON CONFLICT (id) DO UPDATE SET
                    artist = EXCLUDED.artist,
                    play_count = EXCLUDED.play_count,
                    status = EXCLUDED.status,
                    last_updated = EXCLUDED.last_updated
            """, (
                beatmapset['id'],
                beatmapset['artist'],
                beatmapset.get('artist_unicode'),
                beatmapset['creator'],
                beatmapset.get('favourite_count', 0),
                beatmapset.get('genre_id'),
                beatmapset.get('language_id'),
                beatmapset.get('nsfw', False),
                beatmapset.get('play_count', 0),
                beatmapset.get('source'),
                beatmapset['status'],
                beatmapset['title'],
                beatmapset.get('title_unicode'),
                beatmapset['user_id'],
                beatmapset.get('video', False),
                beatmapset.get('bpm'),
                beatmapset.get('discussion_enabled', True),
                beatmapset.get('discussion_locked', False),
                beatmapset.get('is_scoreable', True),
                beatmapset.get('last_updated'),
                beatmapset.get('ranked_date'),
                beatmapset.get('submitted_date'),
                beatmapset.get('storyboard', False),
                beatmapset.get('rating'),
                ' '.join(beatmapset.get('tags', [])),
                json.dumps(beatmapset['covers']),
                json.dumps(beatmapset.get('availability', {})),
                json.dumps(beatmapset.get('nominations_summary', {}))
            ))

            # Insert beatmaps
            for beatmap in beatmapset.get('beatmaps', []):
                self.cursor.execute("""
                    INSERT INTO beatmaps (
                        id, beatmapset_id, difficulty_rating, mode, status, total_length,
                        user_id, version, accuracy, ar, bpm, cs, drain, hit_length,
                        is_scoreable, last_updated, mode_int, passcount, playcount,
                        url, max_combo, count_circles, count_sliders, count_spinners,
                        checksum
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                    ) ON CONFLICT (id) DO UPDATE SET
                        difficulty_rating = EXCLUDED.difficulty_rating,
                        status = EXCLUDED.status,
                        last_updated = EXCLUDED.last_updated
                """, (
                    beatmap['id'],
                    beatmap['beatmapset_id'],
                    beatmap['difficulty_rating'],
                    beatmap['mode'],
                    beatmap['status'],
                    beatmap['total_length'],
                    beatmap['user_id'],
                    beatmap['version'],
                    beatmap.get('accuracy'),
                    beatmap['ar'],
                    beatmap.get('bpm'),
                    beatmap['cs'],
                    beatmap.get('drain'),
                    beatmap.get('hit_length'),
                    beatmap.get('is_scoreable', True),
                    beatmap.get('last_updated'),
                    beatmap.get('mode_int'),
                    beatmap.get('passcount'),
                    beatmap.get('playcount'),
                    beatmap.get('url'),
                    beatmap.get('max_combo'),
                    beatmap.get('count_circles'),
                    beatmap.get('count_sliders'),
                    beatmap.get('count_spinners'),
                    beatmap.get('checksum')
                ))
                self.total_beatmaps += 1

            self.db_conn.commit()
            self.total_beatmapsets += 1
            self.last_ranked_date = beatmapset.get('ranked_date')

            if self.total_beatmapsets % 100 == 0:
                logging.info(f"Processed {self.total_beatmapsets} beatmapsets ({self.total_beatmaps} beatmaps)")

        except Exception as e:
            self.db_conn.rollback()
            logging.error(f"Failed to process beatmapset {beatmapset.get('id')}: {str(e)}")

    def run_import(self, max_requests=1000):
        """Main import loop"""
        logging.info("Starting beatmap import")
        cursor = None
        request_count = 0

        while request_count < max_requests:
            data = self.fetch_beatmapsets(cursor)
            if not data or not data.get('beatmapsets'):
                break

            for beatmapset in data['beatmapsets']:
                self.process_beatmapset(beatmapset)

            cursor = data.get('cursor')
            request_count += 1
            
            # Respect rate limits (120 requests per minute)
            #time.sleep(0.5)  # ~2 requests per second

        logging.info(f"Import completed. Total: {self.total_beatmapsets} beatmapsets, {self.total_beatmaps} beatmaps")

    def __del__(self):
        self.cursor.close()
        self.db_conn.close()

if __name__ == '__main__':
    importer = OsuBeatmapImporter()
    importer.run_import()