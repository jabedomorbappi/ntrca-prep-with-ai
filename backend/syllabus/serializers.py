from rest_framework import serializers
from .models import Subject  # Imports Subject from the syllabus app models

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'  # This sends all subject fields (id, name, etc.) to React