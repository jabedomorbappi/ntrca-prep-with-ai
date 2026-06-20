import json
import re
import random
from django.db import transaction
from ai_engine.mcq_generator import generate_mcqs

def generate_exam(topic, subtopic, num_questions, difficulty, timer_minutes=20, use_question_bank=True):
    # LAZY IMPORTS: Fixes the ImportError by loading models only when called
    # from .models import Exam, ExamQuestion, ExamOption, QuestionBank
    from .models import Exam, ExamQuestion, ExamOption
    from question_bank.models import QuestionBank

    topic_name = topic.name
    subtopic_name = subtopic.name if subtopic else ""

    # 1. OPTIMIZED PRE-FETCHING: Prevents N+1 database queries
    qb_query = QuestionBank.objects.filter(topic=topic)
    if subtopic:
        qb_query = qb_query.filter(subtopic=subtopic)
    
    qb_list = list(qb_query.prefetch_related('options'))
    
    # 2. HANDLE LOCAL BANK REUSE
    if use_question_bank and len(qb_list) >= num_questions:
        selected_qbs = random.sample(qb_list, num_questions)
        with transaction.atomic():
            exam = Exam.objects.create(
                topic=topic, subtopic=subtopic, num_questions=num_questions, 
                title=f"{topic_name} Mock Test", duration_minutes=timer_minutes
            )
            
            # Bulk create Questions
            new_questions = [ExamQuestion(exam=exam, question_text=qb.question_text, explanation=qb.explanation) for qb in selected_qbs]
            ExamQuestion.objects.bulk_create(new_questions)
            
            # Bulk create Options associated with new questions
            new_options = []
            for i, q in enumerate(new_questions):
                for opt in selected_qbs[i].options.all():
                    new_options.append(ExamOption(question=q, text=opt.text, is_correct=opt.is_correct))
            ExamOption.objects.bulk_create(new_options)
            
        return {"status": "success", "exam_id": exam.id, "mode": "banked"}

    # 3. AI GENERATION & EFFICIENT BULK PERSISTENCE
    # raw_data = generate_mcqs(topic_name, subtopic_name, num_questions, difficulty)
    try:
        raw_data = generate_mcqs(topic_name, subtopic_name, num_questions, difficulty)
    except Exception as e:
        return {"status": "error", "message": f"AI provider failed: {str(e)}"}
    data = parse_mcq_json(raw_data)
    if not data: return {"status": "error", "message": "AI failed"}

    with transaction.atomic():
        exam = Exam.objects.create(
            topic=topic, subtopic=subtopic, title=f"{topic_name} Test", 
            num_questions=num_questions, duration_minutes=timer_minutes
        )
        
        exam_questions = []
        for item in data:
            q_text = item.get("question") or item.get("question_text")
            if not q_text: continue
            exam_questions.append(ExamQuestion(exam=exam, question_text=q_text, explanation=item.get("explanation", "")))

        # Bulk save questions
        ExamQuestion.objects.bulk_create(exam_questions)

        # Map options to saved questions
        exam_options = []
        for i, q in enumerate(exam_questions):
            correct_ans = str(data[i].get("answer", "")).strip().lower()
            for opt_text in data[i].get("options", []):
                is_correct = (str(opt_text).strip().lower() == correct_ans)
                exam_options.append(ExamOption(question=q, text=opt_text, is_correct=is_correct))

        # Bulk save all options
        ExamOption.objects.bulk_create(exam_options)

    return {"status": "success", "exam_id": exam.id, "mode": "ai_generated"}

def parse_mcq_json(raw):
    try:
        if not raw: return None
        if isinstance(raw, list): return raw
        if isinstance(raw, dict): return [raw]
        if isinstance(raw, str):
            clean = raw.replace("```json", "").replace("```", "").strip()
            match = re.search(r"\[.*\]", clean, re.DOTALL)
            return json.loads(match.group()) if match else None
    except Exception as e:
        print(f"❌ PARSE ERROR: {e}")
        return None
    return None