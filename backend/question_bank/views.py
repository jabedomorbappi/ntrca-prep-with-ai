from django.shortcuts import render
from django.http import JsonResponse
from .models import QuestionBank

def get_study_questions(request, subtopic_id):
    questions = QuestionBank.objects.filter(subtopic_id=subtopic_id).prefetch_related('options')
    data = []
    for q in questions:
        data.append({
            "id": q.id,
            "question": q.question_text,  # Changed from question_text to question
            "explanation": q.explanation,
            "options": [{"id": o.id, "text": o.text, "is_correct": o.is_correct} 
                        for o in q.options.all()]
        })
    return JsonResponse(data, safe=False)