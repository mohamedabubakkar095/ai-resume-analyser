from django.db import models
from django.conf import settings
from resume.models import Resume

class JobDescription(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='job_descriptions'
    )
    title = models.CharField(max_length=255, blank=True, default="Target Job Profile")
    text_content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title or f"Job Description {self.id}"


class ResumeAnalysis(models.Model):
    resume = models.OneToOneField(Resume, on_delete=models.CASCADE, related_name='analysis')
    job_description = models.ForeignKey(
        JobDescription, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='analyses'
    )
    ats_score = models.IntegerField(default=0)
    parsed_data = models.JSONField(default=dict)
    raw_ai_response = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Analysis of {self.resume.file_name} (Score: {self.ats_score})"
