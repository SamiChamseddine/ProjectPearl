from django.urls import path
from .views import BeatmapSearchView  # Make sure to import BeatmapSearchView

urlpatterns = [
    #path('get-token/', get_osu_token, name='get_osu_token'),
    path('beatmaps/search/', BeatmapSearchView.as_view(), name='beatmap-search'),  # Add this line
]