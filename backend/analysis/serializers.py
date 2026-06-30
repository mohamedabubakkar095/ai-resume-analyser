from rest_framework import serializers
from .models import JobDescription, ResumeAnalysis
from resume.serializers import ResumeSerializer

class JobDescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobDescription
        fields = ['id', 'title', 'text_content', 'created_at']
        read_only_fields = ['id', 'created_at']


class ResumeAnalysisSerializer(serializers.ModelSerializer):
    resume = ResumeSerializer(read_only=True)
    job_description = JobDescriptionSerializer(read_only=True)

    class Meta:
        model = ResumeAnalysis
        fields = ['id', 'resume', 'job_description', 'ats_score', 'parsed_data', 'created_at']
        read_only_fields = ['id', 'ats_score', 'parsed_data', 'created_at']


class AnalyzeRequestSerializer(serializers.Serializer):
    resume_id = serializers.IntegerField(required=True)
    job_description_id = serializers.IntegerField(required=False, allow_null=True)
    job_description_text = serializers.CharField(required=False, allow_blank=True, default="")
    job_title = serializers.CharField(required=False, max_length=255, default="Target Job Profile")
