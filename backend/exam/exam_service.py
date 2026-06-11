import json
import re
import random
from django.db import transaction
from django.utils import timezone

from .models import Exam, ExamQuestion, ExamOption
from ai_engine.mcq_generator import generate_mcqs
from question_bank.models import QuestionBank, QuestionBankOption


# =========================
# SAFE JSON PARSER
# =========================
def parse_mcq_json(raw):
    try:
        if not raw:
            return None

        if isinstance(raw, list):
            return raw

        if isinstance(raw, dict):
            return [raw]

        if isinstance(raw, str):
            clean = raw.replace("```json", "").replace("```", "").strip()

            match = re.search(r"\[.*\]", clean, re.DOTALL)
            if not match:
                print("❌ NO JSON FOUND")
                return None

            return json.loads(match.group())

    except Exception as e:
        print("❌ PARSE ERROR:", str(e))
        return None

    return None


# =========================
# MAIN GENERATOR (V2 - HYBRID DATABASE FIRST)
# =========================
from django.db import transaction, IntegrityError
from question_bank.models import QuestionBank, QuestionBankOption
from exam.models import Exam, ExamQuestion, ExamOption
import random

def generate_exam(
    topic,
    subtopic,
    num_questions,
    difficulty,
    timer_minutes=20,
    use_question_bank=True
):
    topic_name = topic.name
    subtopic_name = subtopic.name if subtopic else ""

    # =====================================================================
    # 🔍 STEP 1: CHECK LOCAL QUESTION BANK FIRST
    # =====================================================================
    qb_query = QuestionBank.objects.filter(topic=topic)
    if subtopic:
        qb_query = qb_query.filter(subtopic=subtopic)
        
    qb_list = list(qb_query)
    available_count = len(qb_list)
    
    # =====================================================================
    # 🎯 CASE A: SUFFICIENT LOCAL POOL FOUND
    # =====================================================================
    if use_question_bank and available_count >= num_questions:
        selected_qbs = random.sample(qb_list, num_questions)
        
        with transaction.atomic():
            exam = Exam.objects.create(
                topic=topic,
                subtopic=subtopic,
                title=f"{topic_name} - {subtopic_name if subtopic_name else 'Comprehensive'} Mock Test",
                num_questions=num_questions,
                difficulty=difficulty,
                duration_minutes=timer_minutes
            )

            for qb in selected_qbs:
                q = ExamQuestion.objects.create(
                    exam=exam,
                    question_text=qb.question_text,
                    explanation=qb.explanation or ""
                )
                for opt in qb.options.all():
                    ExamOption.objects.create(
                        question=q,
                        text=opt.text,
                        is_correct=opt.is_correct
                    )
        return {"status": "success", "exam_id": exam.id, "mode": "bank_reused"}

    # =====================================================================
    # 📡 CASE B: AI GENERATES & PERSISTS
    # =====================================================================
    raw_data = generate_mcqs(topic_name, subtopic_name, num_questions, difficulty)
    data = parse_mcq_json(raw_data)

    if not data:
        return {"status": "error", "message": "AI failed or invalid JSON"}

    with transaction.atomic():
        exam = Exam.objects.create(
            topic=topic,
            subtopic=subtopic,
            title=f"{topic_name} - {subtopic_name}",
            num_questions=num_questions,
            difficulty=difficulty,
            duration_minutes=timer_minutes
        )

        for item in data:
            question_text = item.get("question") or item.get("question_text")
            options = item.get("options") or item.get("choices") or []
            correct_answer = item.get("answer") or item.get("correct_answer")
            explanation = item.get("explanation", "")

            if not question_text: continue

            try:
                # 💾 SEED TO QUESTION BANK WITH INTEGRITY CHECK
                with transaction.atomic():
                    qb, created = QuestionBank.objects.get_or_create(
                        topic=topic,
                        subtopic=subtopic,
                        question_text=question_text,
                        defaults={"explanation": explanation, "source": "ai"}
                    )

                    if created:
                        for opt in options:
                            is_correct = (str(opt).strip().lower() == str(correct_answer).strip().lower())
                            QuestionBankOption.objects.create(question=qb, text=opt, is_correct=is_correct)

                    # 📋 COPY TO ACTIVE EXAM
                    q = ExamQuestion.objects.create(
                        exam=exam, question_text=question_text, explanation=explanation
                    )
                    for opt in options:
                        is_correct = (str(opt).strip().lower() == str(correct_answer).strip().lower())
                        ExamOption.objects.create(question=q, text=opt, is_correct=is_correct)

            except IntegrityError:
                print(f"⚠️ [Exam Service] Duplicate detected. Skipping...")
                continue

    return {"status": "success", "exam_id": exam.id, "mode": "ai+banked"}