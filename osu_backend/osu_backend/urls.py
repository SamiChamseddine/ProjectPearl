from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView  # Add this import
from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from osu_api.views import RegisterView, UserProfileView  # Import your custom views
from django.http import JsonResponse

urlpatterns = [
    path('', lambda r: JsonResponse({"status": "API is live"})),  # Health check
    path('admin/', admin.site.urls),
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/profile/', UserProfileView.as_view(), name='user_profile'),
    path('api/', include('osu_api.urls')),
]