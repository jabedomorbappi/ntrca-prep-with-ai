from django.urls import path

from .views import (
    subject_list,
    topic_list,
    subtopic_list,
)

urlpatterns = [
    path("subjects/", subject_list),
    path("topics/<int:subject_id>/", topic_list),
    path("subtopics/<int:topic_id>/", subtopic_list),
]