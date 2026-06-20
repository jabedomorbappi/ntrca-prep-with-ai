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
import random
from django.db import transaction
from django.db import IntegrityError
from .models import Exam, ExamQuestion, ExamOption, QuestionBank, QuestionBankOption

def generate_exam(topic, subtopic, num_questions, difficulty, timer_minutes=20, use_question_bank=True):
    topic_name = topic.name
    subtopic_name = subtopic.name if subtopic else ""

    # 1. OPTIMIZED PRE-FETCHING (Prevents N+1 queries & memory bloat)
    qb_query = QuestionBank.objects.filter(topic=topic)
    if subtopic:
        qb_query = qb_query.filter(subtopic=subtopic)
    
    qb_list = list(qb_query.prefetch_related('options'))
    
    # 2. HANDLE LOCAL BANK REUSE
    if use_question_bank and len(qb_list) >= num_questions:
        selected_qbs = random.sample(qb_list, num_questions)
        with transaction.atomic():
            exam = Exam.objects.create(topic=topic, subtopic=subtopic, num_questions=num_questions, 
                                       title=f"{topic_name} Mock Test", duration_minutes=timer_minutes)
            
            new_questions = [ExamQuestion(exam=exam, question_text=qb.question_text, explanation=qb.explanation) for qb in selected_qbs]
            ExamQuestion.objects.bulk_create(new_questions)
            
            # Map options to new questions
            new_options = []
            for i, q in enumerate(new_questions):
                for opt in selected_qbs[i].options.all():
                    new_options.append(ExamOption(question=q, text=opt.text, is_correct=opt.is_correct))
            ExamOption.objects.bulk_create(new_options)
            
        return {"status": "success", "exam_id": exam.id}

    # 3. AI GENERATION & EFFICIENT PERSISTENCE
    raw_data = generate_mcqs(topic_name, subtopic_name, num_questions, difficulty)
    data = parse_mcq_json(raw_data)
    if not data: return {"status": "error", "message": "AI failed"}

    with transaction.atomic():
        exam = Exam.objects.create(topic=topic, subtopic=subtopic, title=f"{topic_name} Test", 
                                   num_questions=num_questions, duration_minutes=timer_minutes)
        
        exam_questions = []
        exam_options = []

        for item in data:
            q_text = item.get("question") or item.get("question_text")
            if not q_text: continue
            
            # Create question object in memory
            exam_q = ExamQuestion(exam=exam, question_text=q_text, explanation=item.get("explanation", ""))
            exam_questions.append(exam_q)

        # Batch save questions
        ExamQuestion.objects.bulk_create(exam_questions)

        # Create options associated with saved questions
        for i, q in enumerate(exam_questions):
            correct_ans = str(data[i].get("answer", "")).strip().lower()
            for opt_text in data[i].get("options", []):
                is_correct = (str(opt_text).strip().lower() == correct_ans)
                exam_options.append(ExamOption(question=q, text=opt_text, is_correct=is_correct))

        # Batch save options
        ExamOption.objects.bulk_create(exam_options)

    return {"status": "success", "exam_id": exam.id}