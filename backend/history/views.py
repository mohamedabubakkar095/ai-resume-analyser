from rest_framework import generics, permissions
from django.db.models import Q
from analysis.models import ResumeAnalysis
from .serializers import ResumeAnalysisSummarySerializer

class HistoryListView(generics.ListAPIView):
    serializer_class = ResumeAnalysisSummarySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = ResumeAnalysis.objects.filter(resume__user=self.request.user).order_by('-created_at')
        q = self.request.query_params.get('q', None)
        if q:
            queryset = queryset.filter(
                Q(resume__file_name__icontains=q) | 
                Q(job_description__title__icontains=q)
            )
        return queryset
