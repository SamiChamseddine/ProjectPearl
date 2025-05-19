from django.db import models

class BeatmapSet(models.Model):
    id = models.BigIntegerField(primary_key=True)
    artist = models.TextField()
    artist_unicode = models.TextField(blank=True, null=True)
    creator = models.TextField()
    favourite_count = models.IntegerField(default=0)
    genre_id = models.SmallIntegerField(blank=True, null=True)
    language_id = models.SmallIntegerField(blank=True, null=True)
    nsfw = models.BooleanField(default=False)
    play_count = models.IntegerField(default=0)
    source = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20)
    title = models.TextField()
    title_unicode = models.TextField(blank=True, null=True)
    user_id = models.BigIntegerField(blank=True, null=True)
    video = models.BooleanField(default=False)
    bpm = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    discussion_enabled = models.BooleanField(default=True)
    discussion_locked = models.BooleanField(default=False)
    is_scoreable = models.BooleanField(default=True)
    last_updated = models.DateTimeField(blank=True, null=True)
    ranked_date = models.DateTimeField(blank=True, null=True)
    submitted_date = models.DateTimeField(blank=True, null=True)
    storyboard = models.BooleanField(default=False)
    rating = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    covers = models.JSONField()
    availability = models.JSONField(blank=True, null=True)
    nominations_summary = models.JSONField(blank=True, null=True)
    tags = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['ranked_date'], name='idx_beatmapsets_ranked_date'),
            models.Index(fields=['favourite_count'], name='idx_beatmapsets_fav_count'),
            models.Index(fields=['artist'], name='idx_beatmapsets_artist'),
            models.Index(fields=['title'], name='idx_beatmapsets_title'),
        ]
        app_label = 'osu_api'
        db_table = 'beatmapsets'

class Beatmap(models.Model):
    MODE_CHOICES = [
        ('osu', 'osu!standard'),
        ('taiko', 'osu!taiko'),
        ('fruits', 'osu!catch'),
        ('mania', 'osu!mania'),
    ]
    
    id = models.BigIntegerField(primary_key=True)
    beatmapset = models.ForeignKey(BeatmapSet, on_delete=models.CASCADE, related_name='beatmaps')
    difficulty_rating = models.DecimalField(max_digits=4, decimal_places=2)
    version = models.TextField()
    mode = models.CharField(max_length=10, choices=MODE_CHOICES)
    total_length = models.IntegerField()
    user_id = models.BigIntegerField(blank=True, null=True)
    accuracy = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True)
    ar = models.DecimalField(max_digits=3, decimal_places=1)
    bpm = models.DecimalField(max_digits=6, decimal_places=2)
    cs = models.DecimalField(max_digits=3, decimal_places=1)
    drain = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True)
    hit_length = models.IntegerField(blank=True, null=True)
    is_scoreable = models.BooleanField(default=True)
    last_updated = models.DateTimeField(blank=True, null=True)
    mode_int = models.SmallIntegerField(blank=True, null=True)
    passcount = models.IntegerField(blank=True, null=True)
    playcount = models.IntegerField(blank=True, null=True)
    max_combo = models.IntegerField(blank=True, null=True)
    status = models.CharField(max_length=20)
    checksum = models.CharField(max_length=32, blank=True, null=True)
    url = models.TextField(blank=True, null=True)
    count_circles = models.IntegerField(blank=True, null=True)
    count_sliders = models.IntegerField(blank=True, null=True)
    count_spinners = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['difficulty_rating', 'ar', 'cs', 'bpm'], name='idx_beatmaps_main'),
            models.Index(fields=['mode'], name='idx_beatmaps_mode'),
            models.Index(fields=['beatmapset'], name='idx_beatmaps_setid'),
        ]
        app_label = 'osu_api'
        db_table = 'beatmaps'

    def __str__(self):
        return f"{self.beatmapset.artist} - {self.beatmapset.title} [{self.version}]"