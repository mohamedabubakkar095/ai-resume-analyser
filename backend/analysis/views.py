# from rest_framework import status, permissions
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from django.shortcuts import get_object_or_404

# from .models import JobDescription, ResumeAnalysis
# from resume.models import Resume
# from notifications.models import Notification
# from .serializers import (
#     AnalyzeRequestSerializer,
#     ResumeAnalysisSerializer,
#     JobDescriptionSerializer,
# )
# from .utils import extract_text_from_pdf
# from .ai_client import analyze_resume_text

# import traceback


# class AnalyzeResumeView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def post(self, request):
#         try:
#             serializer = AnalyzeRequestSerializer(data=request.data)
#             serializer.is_valid(raise_exception=True)

#             resume_id = serializer.validated_data["resume_id"]
#             job_description_id = serializer.validated_data.get("job_description_id")
#             job_description_text = serializer.validated_data.get("job_description_text")
#             job_title = serializer.validated_data.get("job_title", "Target Job Profile")

#             print("STEP 1")

#             resume = get_object_or_404(
#                 Resume,
#                 id=resume_id,
#                 user=request.user,
#             )

#             print("STEP 2")

#             if not resume.file:
#                 raise Exception("Resume file missing")

#             resume_text = extract_text_from_pdf(resume.file.path)

#             print("STEP 3")

#             job_description = None

#             if job_description_id:
#                 job_description = get_object_or_404(
#                     JobDescription,
#                     id=job_description_id,
#                     user=request.user,
#                 )

#             elif job_description_text:
#                 job_description = JobDescription.objects.create(
#                     user=request.user,
#                     title=job_title,
#                     text_content=job_description_text,
#                 )

#             print("STEP 4")

#             analysis_dict = analyze_resume_text(
#                 resume_text,
#                 job_description.text_content if job_description else "",
#             )

#             print("STEP 5")

#             ats_score = int(analysis_dict.get("ats_score", 0))

#             analysis = ResumeAnalysis.objects.create(
#                 resume=resume,
#                 job_description=job_description,
#                 ats_score=ats_score,
#                 parsed_data=analysis_dict,
#                 raw_ai_response=str(analysis_dict),
#             )

#             print("STEP 6")

#             Notification.objects.create(
#                 user=request.user,
#                 message="Analysis completed",
#                 type="success",
#             )

#             print("STEP 7")

#             return Response(
#                 ResumeAnalysisSerializer(analysis).data,
#                 status=status.HTTP_200_OK,
#             )

#         except Exception as e:
#             traceback.print_exc()

#             return Response(
#                 {
#                     "error": str(e),
#                     "type": type(e).__name__,
#                 },
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             )


# # புதிய கிளாஸ் வியூ - இங்கே இணைக்கப்பட்டுள்ளது
# class AnalysisReportDetailView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def get(self, request, pk):
#         try:
#             # லாகின் செய்த யூசருடைய குறிப்பிட்ட ரிப்போர்ட்டை எடுக்கிறோம்
#             analysis = get_object_or_404(ResumeAnalysis, id=pk, resume__user=request.user)
#             serializer = ResumeAnalysisSerializer(analysis)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response(
#                 {"error": str(e)}, 
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )



# import traceback
# import json  # json இம்போர்ட் செய்யப்பட்டுள்ளது
# from django.shortcuts import get_object_or_404
# from rest_framework import permissions, status
# from rest_framework.response import Response
# from rest_framework.views import APIView

# from resume.models import Resume
# from notifications.models import Notification
# from .ai_client import analyze_resume_text
# from .models import JobDescription, ResumeAnalysis
# from .serializers import (
#     AnalyzeRequestSerializer,
#     JobDescriptionSerializer,
#     ResumeAnalysisSerializer,
# )
# from .utils import extract_text_from_pdf


# class AnalyzeResumeView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def post(self, request):
#         try:
#             serializer = AnalyzeRequestSerializer(data=request.data)
#             serializer.is_valid(raise_exception=True)

#             resume_id = serializer.validated_data["resume_id"]
#             job_description_id = serializer.validated_data.get("job_description_id")
#             job_description_text = serializer.validated_data.get("job_description_text")
#             job_title = serializer.validated_data.get("job_title", "Target Job Profile")

#             print("STEP 1")

#             resume = get_object_or_404(
#                 Resume,
#                 id=resume_id,
#                 user=request.user,
#             )

#             print("STEP 2")

#             if not resume.file:
#                 raise Exception("Resume file missing")

#             resume_text = extract_text_from_pdf(resume.file.path)

#             print("STEP 3")

#             job_description = None

#             if job_description_id:
#                 job_description = get_object_or_404(
#                     JobDescription,
#                     id=job_description_id,
#                     user=request.user,
#                 )
#             elif job_description_text:
#                 job_description = JobDescription.objects.create(
#                     user=request.user,
#                     title=job_title,
#                     text_content=job_description_text,
#                 )

#             print("STEP 4")

#             analysis_dict = analyze_resume_text(
#                 resume_text,
#                 job_description.text_content if job_description else "",
#             )

#             print("STEP 5")

#             # பாதுகாப்பான முறையில் Integer ஆக மாற்றுதல்
#             try:
#                 ats_score = int(analysis_dict.get("ats_score", 0))
#             except (ValueError, TypeError):
#                 ats_score = 0

#             analysis = ResumeAnalysis.objects.create(
#                 resume=resume,
#                 job_description=job_description,
#                 ats_score=ats_score,
#                 parsed_data=analysis_dict,
#                 raw_ai_response=json.dumps(analysis_dict),  # சுத்தமான JSON ஆக சேமிக்கப்படுகிறது
#             )

#             print("STEP 6")

#             Notification.objects.create(
#                 user=request.user,
#                 message="Analysis completed",
#                 type="success",
#             )

#             print("STEP 7")

#             return Response(
#                 ResumeAnalysisSerializer(analysis).data,
#                 status=status.HTTP_200_OK,
#             )

#         except Exception as e:
#             traceback.print_exc()
#             return Response(
#                 {
#                     "error": str(e),
#                     "type": type(e).__name__,
#                 },
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             )


# class AnalysisReportDetailView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def get(self, request, pk):
#         try:
#             analysis = get_object_or_404(ResumeAnalysis, id=pk, resume__user=request.user)
#             serializer = ResumeAnalysisSerializer(analysis)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response(
#                 {"error": str(e)}, 
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )



import traceback
import json  # json இம்போர்ட் செய்யப்பட்டுள்ளது
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from resume.models import Resume
from notifications.models import Notification
from .ai_client import analyze_resume_text
from .models import JobDescription, ResumeAnalysis
from .serializers import (
    AnalyzeRequestSerializer,
    JobDescriptionSerializer,
    ResumeAnalysisSerializer,
)
from .utils import extract_text_from_pdf


class AnalyzeResumeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            serializer = AnalyzeRequestSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            resume_id = serializer.validated_data["resume_id"]
            job_description_id = serializer.validated_data.get("job_description_id")
            job_description_text = serializer.validated_data.get("job_description_text")
            job_title = serializer.validated_data.get("job_title", "Target Job Profile")

            print("STEP 1")

            resume = get_object_or_404(
                Resume,
                id=resume_id,
                user=request.user,
            )

            print("STEP 2")

            if not resume.file:
                raise Exception("Resume file missing")

            resume_text = extract_text_from_pdf(resume.file.path)

            print("STEP 3")

            job_description = None

            if job_description_id:
                job_description = get_object_or_404(
                    JobDescription,
                    id=job_description_id,
                    user=request.user,
                )
            elif job_description_text:
                job_description = JobDescription.objects.create(
                    user=request.user,
                    title=job_title,
                    text_content=job_description_text,
                )

            print("STEP 4")

            analysis_dict = analyze_resume_text(
                resume_text,
                job_description.text_content if job_description else "",
            )

            print("STEP 5")

            # பாதுகாப்பான முறையில் Integer ஆக மாற்றுதல்
            try:
                ats_score = int(analysis_dict.get("ats_score", 0))
            except (ValueError, TypeError):
                ats_score = 0

            analysis = ResumeAnalysis.objects.create(
                resume=resume,
                job_description=job_description,
                ats_score=ats_score,
                parsed_data=analysis_dict,
                raw_ai_response=json.dumps(analysis_dict),  # சுத்தமான JSON ஆக சேமிக்கப்படுகிறது
            )

            print("STEP 6")

            Notification.objects.create(
                user=request.user,
                message="Analysis completed",
                type="success",
            )

            print("STEP 7")

            return Response(
                ResumeAnalysisSerializer(analysis).data,
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            traceback.print_exc()
            return Response(
                {
                    "error": str(e),
                    "type": type(e).__name__,
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class AnalysisReportDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    # 1. ஹிஸ்டரி ரிப்போர்ட்டை எடுத்துப் பார்க்கும் மெத்தட் (GET)
    def get(self, request, pk):
        try:
            analysis = get_object_or_404(ResumeAnalysis, id=pk, resume__user=request.user)
            serializer = ResumeAnalysisSerializer(analysis)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    # 2. ஹிஸ்டரி ரிப்போர்ட்டை டெலிட் செய்யும் மெத்தட் (DELETE) - இதுதான் விடுபட்டிருந்தது!
    def delete(self, request, pk):
        try:
            analysis = get_object_or_404(ResumeAnalysis, id=pk, resume__user=request.user)
            analysis.delete()  # டேட்டாபேஸிலிருந்து தரவை நீக்குகிறது
            return Response(
                {"message": "Successfully deleted"}, 
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )