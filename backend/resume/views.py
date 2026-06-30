import os
from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Resume
from .serializers import ResumeSerializer

class ResumeUploadView(generics.CreateAPIView):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        uploaded_file = self.request.data.get('file')
        file_name = uploaded_file.name
        file_size = uploaded_file.size
        serializer.save(
            user=self.request.user,
            file_name=file_name,
            file_size=file_size
        )
