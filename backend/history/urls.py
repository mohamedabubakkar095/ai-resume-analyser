from django.urls import path
from .views import HistoryListView

urlpatterns = [
    path('', HistoryListView.as_view(), name='history_list'),
]
