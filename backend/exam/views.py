from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes

from syllabus.models import Topic, SubTopic
from question_bank.models import Option
from .exam_service import generate_exam
from .models import (
    Exam, 
    ExamQuestion, 
    ExamOption, 
    ExamAttempt, 
    ExamAttemptAnswer, 
    ExamSnapshot
)
from rest_framework.permissions import AllowAny

@api_view(["POST"])
@permission_classes([AllowAny])
def create_exam(request):
    snapshot_id = request.data.get("snapshot_id")

    # 🎯 IF SNAPSHOT_ID IS PROVIDED, DIRECTLY RESUME IT
    if snapshot_id:
        snapshot = ExamSnapshot.objects.filter(id=snapshot_id).first()
        if not snapshot:
            return Response({"error": "Session not found"}, status=404)
        return Response({
            "snapshot_id": snapshot.id,
            "questions": snapshot.questions_json,
            "is_existing": True
        })

    topic_id = request.data.get("topic_id")
    subtopic_id = request.data.get("subtopic_id")
    num_questions = int(request.data.get("num_questions", 10))
    difficulty = request.data.get("difficulty", "medium")
    timer_minutes = int(request.data.get("timer_minutes", 20))
    use_question_bank = request.data.get("use_question_bank", True)

    # Use filter().first() to avoid DoesNotExist/MultipleObjectsReturned crashes
    topic = Topic.objects.filter(id=topic_id).first()
    subtopic = SubTopic.objects.filter(id=subtopic_id).first() if subtopic_id else None

    if not topic:
        return Response({"error": "Topic not found."}, status=404)

    # =====================================================================
    # 🔥 STEP 1: CHECK SNAPSHOT
    # =====================================================================
    if use_question_bank:
        snapshot = ExamSnapshot.objects.filter(
            topic=topic,
            subtopic=subtopic,
            num_questions=num_questions,
            difficulty=difficulty,
            is_used=False
        ).first()

        if snapshot:
            existing_exam_id = None
            if snapshot.questions_json and isinstance(snapshot.questions_json, list) and len(snapshot.questions_json) > 0:
                existing_exam_id = snapshot.questions_json[0].get("exam_id")

            if not existing_exam_id:
                matched_exam = Exam.objects.filter(topic=topic, subtopic=subtopic, difficulty=difficulty).first()
                if matched_exam:
                    existing_exam_id = matched_exam.id

            return Response({
                "snapshot_id": snapshot.id,
                "exam_id": existing_exam_id,
                "questions": snapshot.questions_json,
                "is_existing": True
            })

    # =====================================================================
    # 📡 STEP 2: EXECUTE MAIN EXAM GENERATOR SYSTEM
    # =====================================================================
    result = generate_exam(
        topic,
        subtopic,
        num_questions,
        difficulty,
        timer_minutes=timer_minutes,
        use_question_bank=use_question_bank
    )

    if result.get("status") == "error":
        return Response(
            {"error": result.get("message"), "code": result.get("code")}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    if use_question_bank:
        ExamSnapshot.objects.create(
            topic=topic,
            subtopic=subtopic,
            num_questions=num_questions,
            difficulty=difficulty,
            questions_json=result.get("questions", [])
        )

    return Response({
        "status": "success",
        "exam_id": result.get("exam_id"),
        "is_existing": False
    })
@api_view(["POST"])
@permission_classes([AllowAny])
def start_exam(request):
    snapshot_id = request.data.get("snapshot_id")
    exam_id = request.data.get("exam_id")

    try:
        def get_calculated_duration(num_questions):
            # 60% rule: 0.6 mins per question, min 1 min
            return max(int(num_questions * 0.6), 1)

        exam = None

        if snapshot_id:
            snapshot = ExamSnapshot.objects.filter(id=snapshot_id).first()
            if not snapshot:
                return Response({"error": "Snapshot not found"}, status=404)
            
            exam = Exam.objects.filter(
                topic=snapshot.topic, 
                subtopic=snapshot.subtopic,num_questions=snapshot.num_questions).first()
            
            if not exam:
                duration = get_calculated_duration(snapshot.num_questions)
                exam = Exam.objects.create(
                    topic=snapshot.topic,
                    subtopic=snapshot.subtopic,
                    title=f"Exam: {snapshot.topic.name}",
                    difficulty=snapshot.difficulty,
                    num_questions=snapshot.num_questions,
                    duration_minutes=duration
                )
            
        elif exam_id:
            exam = Exam.objects.filter(id=exam_id).first()
            if not exam:
                return Response({"error": "Exam not found"}, status=404)
            
            # Apply 60% rule if duration is uninitialized
            if exam.duration_minutes == 0 or exam.duration_minutes is None:
                exam.duration_minutes = get_calculated_duration(exam.num_questions)
                exam.save()
        else:
            return Response({"error": "No ID provided"}, status=400)

        # Fetch or create the active attempt
        attempt = ExamAttempt.objects.filter(exam=exam, is_completed=False).first()
        if not attempt:
            attempt = ExamAttempt.objects.create(exam=exam, started_at=timezone.now())

        # Return response matching frontend expectations
        return Response({
            "status": "started",
            "attempt_id": attempt.id,
            "exam_id": exam.id, # Fixed: was exam.exam.id
            "duration_minutes": exam.duration_minutes
        })

    except Exception as e:
        print(f"DEBUG: Start Exam Error: {str(e)}")
        return Response({"error": str(e)}, status=500)
@api_view(["POST"])
@permission_classes([AllowAny])
def save_answer(request):
    try:
        attempt_id = request.data.get("attempt_id")
        question_id = request.data.get("question_id")
        option_id = request.data.get("option_id")

        option = ExamOption.objects.get(id=option_id)
        is_correct = option.is_correct

        ExamAttemptAnswer.objects.update_or_create(
            attempt_id=attempt_id,
            question_id=question_id,
            defaults={
                "selected_option_id": option_id,
                "is_correct": is_correct
            }
        )
        return Response({"status": "saved"})
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(["POST"])
@permission_classes([AllowAny])
def submit_attempt(request):
    attempt_id = request.data.get("attempt_id")
    exam_id = request.data.get("exam_id")
    answers = request.data.get("answers", {})
    print(f"DEBUG: Received Attempt ID: {attempt_id}")
    print(f"DEBUG: Received Answers: {answers}")

    try:
        attempt = ExamAttempt.objects.get(id=attempt_id)
    except ExamAttempt.DoesNotExist:
        return Response({"error": "Attempt not found"}, status=404)

    correct = 0
    wrong = 0

    for question_id, selected_option_id in answers.items():
        try:
            option = ExamOption.objects.get(id=selected_option_id)
            if option.is_correct:
                correct += 1
            else:
                wrong += 1
        except ExamOption.DoesNotExist:
            continue

    score = correct - (wrong * 0.25)
    attempt.score = score
    attempt.correct_count = correct
    attempt.wrong_count = wrong
    attempt.save()

    return Response({
        "status": "success",
        "score": score,
        "correct": correct,
        "wrong": wrong,
        "attempt_id": attempt.id
    })

@api_view(["GET"])
@permission_classes([AllowAny])
def exam_detail(request, exam_id):
    try:
        exam = Exam.objects.get(id=exam_id)
        return Response({
            "id": exam.id,
            "title": exam.title,
            "topic": exam.topic.name,
            "subtopic": exam.subtopic.name if exam.subtopic else None,
            "difficulty": exam.difficulty,
            "duration_minutes": exam.duration_minutes,
            "questions": [
                {
                    "id": q.id,
                    "question": q.question_text,
                    "options": [
                        {"id": o.id, "text": o.text}
                        for o in q.options.all()
                    ]
                }
                for q in exam.questions.all()
            ]
        })
    except Exam.DoesNotExist:
        return Response({"error": "Exam not found"}, status=404)

@api_view(["GET"])
@permission_classes([AllowAny])
def exam_history(request):
    attempts = ExamAttempt.objects.all().order_by("-started_at")
    return Response([
        {
            "attempt_id": a.id,
            "exam_id": a.exam.id,
            "exam_title": a.exam.title,
            "score": a.score,
            "correct": a.correct_count if hasattr(a, 'correct_count') else 0,
            "wrong": a.wrong_count if hasattr(a, 'wrong_count') else 0,
            "date": a.started_at
        }
        for a in attempts
    ])

@api_view(["GET"])
@permission_classes([AllowAny])
def exam_review(request, attempt_id):
    try:
        attempt = ExamAttempt.objects.get(id=attempt_id)
        exam = attempt.exam
        answers = ExamAttemptAnswer.objects.filter(attempt=attempt)
        answer_map = {a.question_id: a.selected_option_id for a in answers}

        data = {
            "exam_title": exam.title,
            "score": attempt.score,
            "correct": attempt.correct_count,
            "wrong": attempt.wrong_count,
            "questions": []
        }

        for q in exam.questions.all():
            correct_option = q.options.filter(is_correct=True).first()
            selected_id = answer_map.get(q.id)
            selected_option = q.options.filter(id=selected_id).first() if selected_id else None

            data["questions"].append({
                "id": q.id,
                "question": q.question_text,
                "correct_answer": correct_option.text if correct_option else None,
                "selected_answer": selected_option.text if selected_option else "Not Answered",
                "is_correct": selected_option.is_correct if selected_option else False,
                "options": [{"id": o.id, "text": o.text} for o in q.options.all()]
            })
        return Response(data)
    except ExamAttempt.DoesNotExist:
        return Response({"error": "Attempt not found"}, status=404)

@api_view(["GET"])
@permission_classes([AllowAny])
def exam_analytics(request, attempt_id):
    try:
        attempt = ExamAttempt.objects.get(id=attempt_id)
        answers = ExamAttemptAnswer.objects.filter(attempt=attempt)

        total = attempt.exam.questions.count()
        attempted = answers.count()
        correct = answers.filter(is_correct=True).count()
        wrong = attempted - correct

        accuracy = (correct / total * 100) if total > 0 else 0

        return Response({
            "attempt_id": attempt_id,
            "total_questions": total,
            "attempted": attempted,
            "correct": correct,
            "wrong": wrong,
            "accuracy": round(accuracy, 2)
        })
    except ExamAttempt.DoesNotExist:
        return Response({"error": "Attempt not found"}, status=404)

@api_view(["GET"])
@permission_classes([AllowAny])
def subtopic_exam_status(request, subtopic_id):
    exams = Exam.objects.filter(subtopic_id=subtopic_id).order_by("-created_at")
    data = []
    for exam in exams:
        data.append({
            "id": exam.id,
            "title": exam.title,
            "difficulty": exam.difficulty,
            "questions": exam.num_questions,
            "created_at": exam.created_at,
            "taken": exam.attempts.exists()
        })
    return Response(data)

@api_view(["GET"])
@permission_classes([AllowAny])
def exam_snapshots(request, subtopic_id):
    snapshots = ExamSnapshot.objects.filter(subtopic_id=subtopic_id).order_by("-created_at")
    return Response([
        {
            "id": s.id,
            "topic_id": s.topic_id,
            "subtopic_id": s.subtopic_id,
            "num_questions": s.num_questions,
            "difficulty": s.difficulty,
            "is_used": s.is_used,
            "created_at": s.created_at
        }
        for s in snapshots
    ])

@api_view(["GET"])
@permission_classes([AllowAny])
def get_exam_result(request, attempt_id):
    try:
        attempt = ExamAttempt.objects.get(id=attempt_id)
        return Response({
            "status": "success",
            "score": attempt.score,
            "correct": attempt.correct_count,
            "wrong": attempt.wrong_count,
            "exam_title": attempt.exam.title,
            "total_questions": attempt.exam.num_questions
        })
    except ExamAttempt.DoesNotExist:
        return Response({"error": "Attempt not found"}, status=404)
    
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny

@api_view(["GET"])
@authentication_classes([])  # tells DRF not to even attempt to validate the token
@permission_classes([AllowAny])
def get_active_snapshot(request, subtopic_id):
    active_snapshot = ExamSnapshot.objects.filter(
        subtopic_id=subtopic_id,
        is_used=False
    ).order_by("-created_at").first()

    if not active_snapshot:
        return Response(None)

    return Response({
        "id": active_snapshot.id,
        "num_questions": active_snapshot.num_questions,
        "difficulty": active_snapshot.difficulty,
        "created_at": active_snapshot.created_at
    })