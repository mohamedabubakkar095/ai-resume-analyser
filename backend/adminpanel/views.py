from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.db.models import Avg, Count
from authentication.serializers import UserSerializer
from .permissions import IsAdminUserRole
from analysis.models import ResumeAnalysis
from resume.models import Resume

User = get_user_model()

class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUserRole]


class AdminUserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUserRole]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance == request.user:
            return Response(
                {"error": "You cannot delete your own admin account."},
                status=status.HTTP_400_BAD_REQUEST
            )
        self.perform_destroy(instance)
        return Response(
            {"detail": "User deleted successfully."},
            status=status.HTTP_200_OK
        )


class AdminSystemStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUserRole]

    def get(self, request):
        total_users = User.objects.count()
        total_resumes = Resume.objects.count()
        total_analyses = ResumeAnalysis.objects.count()
        
        # Calculate system-wide average ATS score
        avg_ats_agg = ResumeAnalysis.objects.aggregate(avg_score=Avg('ats_score'))
        avg_ats = round(avg_ats_agg['avg_score'], 1) if avg_ats_agg['avg_score'] is not None else 0

        # Distribution of users by role
        roles_breakdown = User.objects.values('role').annotate(count=Count('role'))
        
        # Distribution of scans by date (last 7 days)
        recent_scans = ResumeAnalysis.objects.values('created_at__date').annotate(count=Count('id')).order_by('-created_at__date')[:7]
        scans_timeline = []
        for scan in recent_scans:
            if scan['created_at__date']:
                scans_timeline.append({
                    "date": scan['created_at__date'].strftime("%Y-%m-%d"),
                    "scans": scan['count']
                })
        scans_timeline.reverse()

        return Response({
            "total_users": total_users,
            "total_resumes": total_resumes,
            "total_analyses": total_analyses,
            "avg_ats": avg_ats,
            "roles_breakdown": list(roles_breakdown),
            "scans_timeline": scans_timeline
        })
