from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Subject, Topic, SubTopic


@api_view(["GET"])
@permission_classes([AllowAny])
@authentication_classes([]) # 🔓 Immunizes this public route from broken frontend token headers
def subject_list(request):
    data = [
        {
            "id": s.id,
            "name": s.name
        }
        for s in Subject.objects.all()
    ]
    return Response(data)


@api_view(["GET"])
@permission_classes([AllowAny])
@authentication_classes([]) # 🔓 Safe public access
def topic_list(request, subject_id):
    topics = Topic.objects.filter(subject_id=subject_id)
    data = [
        {
            "id": t.id,
            "name": t.name
        }
        for t in topics
    ]
    return Response(data)


@api_view(["GET"])
@permission_classes([AllowAny])
@authentication_classes([]) # 🔓 Safe public access
def subtopic_list(request, topic_id):
    subtopics = SubTopic.objects.filter(topic_id=topic_id)
    data = [
        {
            "id": st.id,
            "name": st.name
        }
        for st in subtopics
    ]
    return Response(data)