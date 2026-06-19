from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import QuestionBank

@api_view(["GET"])
@permission_classes([AllowAny]) # Explicitly public
def get_study_questions(request, subtopic_id):
    questions = QuestionBank.objects.filter(subtopic_id=subtopic_id).prefetch_related('options')
    data = []
    for q in questions:
        data.append({
            "id": q.id,
            "question": q.question_text, 
            "explanation": q.explanation,
            "options": [{"id": o.id, "text": o.text, "is_correct": o.is_correct} 
                        for o in q.options.all()]
        })
    return Response(data) # Changed to Response for consistency