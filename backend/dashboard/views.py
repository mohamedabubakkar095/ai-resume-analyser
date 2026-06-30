from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Avg
from analysis.models import ResumeAnalysis
from notifications.models import Notification
from collections import Counter

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        analyses = ResumeAnalysis.objects.filter(resume__user=user)
        total_scans = analyses.count()
        
        # Calculate average ATS score
        avg_ats_agg = analyses.aggregate(avg_score=Avg('ats_score'))
        avg_ats = round(avg_ats_agg['avg_score'], 1) if avg_ats_agg['avg_score'] is not None else 0

        # Notifications count
        unread_notifications = Notification.objects.filter(user=user, is_read=False).count()

        # Last 5 analyses for trend chart
        recent_analyses = analyses.order_by('created_at')[:7]
        history_chart_data = []
        for analysis in recent_analyses:
            history_chart_data.append({
                "date": analysis.created_at.strftime("%b %d"),
                "score": analysis.ats_score,
                "label": analysis.resume.file_name[:15] + '...' if len(analysis.resume.file_name) > 15 else analysis.resume.file_name
            })

        # Most common technical skills detection
        all_skills = []
        for analysis in analyses:
            skills_dict = analysis.parsed_data.get('skills', {})
            if isinstance(skills_dict, dict):
                tech_skills = skills_dict.get('technical', [])
                if isinstance(tech_skills, list):
                    all_skills.extend(tech_skills)

        # Count frequencies
        skill_counts = Counter(all_skills)
        top_skills = [{"skill": skill, "count": count} for skill, count in skill_counts.most_common(6)]

        return Response({
            "total_scans": total_scans,
            "avg_ats": avg_ats,
            "unread_notifications": unread_notifications,
            "history_chart_data": history_chart_data,
            "top_skills": top_skills
        })
