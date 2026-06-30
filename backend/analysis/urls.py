# from django.urls import path
# from .views import AnalyzeResumeView,AnalysisReportDetailView

# urlpatterns = [
#     path('analyze/', AnalyzeResumeView.as_view(), name='analyze_resume'),
#     path('report/<int:pk>/', AnalysisReportDetailView.as_view(), name='analysis_report_detail'),
# ]

from django.urls import path
from .views import AnalyzeResumeView, AnalysisReportDetailView

urlpatterns = [
    path('analyze/', AnalyzeResumeView.as_view(), name='analyze_resume'),
    # இங்கே <int:pk> இருக்கிறதா என்று உறுதி செய்து கொள்ளுங்கள்:
    path('report/<int:pk>/', AnalysisReportDetailView.as_view(), name='report_detail'),
]