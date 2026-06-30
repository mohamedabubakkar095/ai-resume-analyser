from rest_framework import serializers
from analysis.models import ResumeAnalysis

class ResumeAnalysisSummarySerializer(serializers.ModelSerializer):
    file_name = serializers.CharField(source='resume.file_name', read_only=True)
    job_title = serializers.CharField(source='job_description.title', read_only=True, default="General Review")
    file_size = serializers.IntegerField(source='resume.file_size', read_only=True)

    class Meta:
        model = ResumeAnalysis
        fields = ['id', 'file_name', 'job_title', 'file_size', 'ats_score', 'created_at']
        read_only_fields = ['id', 'file_name', 'job_title', 'file_size', 'ats_score', 'created_at']
