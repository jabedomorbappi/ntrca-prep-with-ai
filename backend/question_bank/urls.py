from django.urls import path
from .views import get_study_questions

urlpatterns = [
    # This matches the endpoint your StudyPage.jsx is likely calling
    path('questions/<int:subtopic_id>/', get_study_questions, name='get_study_questions'),
]