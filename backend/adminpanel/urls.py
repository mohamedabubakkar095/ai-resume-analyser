from django.urls import path
from .views import AdminUserListView, AdminUserDeleteView, AdminSystemStatsView

urlpatterns = [
    path('users/', AdminUserListView.as_view(), name='admin_users_list'),
    path('users/<int:pk>/', AdminUserDeleteView.as_view(), name='admin_user_delete'),
    path('stats/', AdminSystemStatsView.as_view(), name='admin_system_stats'),
]
