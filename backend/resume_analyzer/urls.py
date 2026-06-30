from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/resume/', include('resume.urls')),
    path('api/analysis/', include('analysis.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/history/', include('history.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/admin/', include('adminpanel.urls')),
]

# Serve media files in development mode
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
