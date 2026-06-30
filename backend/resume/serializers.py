from rest_framework import serializers
from .models import Resume

class ResumeSerializer(serializers.ModelSerializer):
    file_size_kb = serializers.SerializerMethodField()

    class Meta:
        model = Resume
        fields = ['id', 'file', 'file_name', 'file_size', 'file_size_kb', 'uploaded_at']
        read_only_fields = ['id', 'file_name', 'file_size', 'uploaded_at']

    def get_file_size_kb(self, obj):
        return round(obj.file_size / 1024, 2)
