from django.db import models
from syllabus.models import Topic, SubTopic


class Exam(models.Model):

    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    subtopic = models.ForeignKey(SubTopic, on_delete=models.CASCADE, null=True, blank=True)

    title = models.CharField(max_length=255)
    num_questions = models.IntegerField(default=10)
    difficulty = models.CharField(max_length=10, choices=[
        ("easy","Easy"),
        ("medium","Medium"),
        ("hard","Hard")
    ], default="medium")

    # 🔥 NEW FEATURES
    timer_minutes = models.IntegerField(default=20)
    negative_marking = models.BooleanField(default=False)
    adaptive_mode = models.BooleanField(default=False)
    duration_minutes = models.IntegerField(default=10)   # ✅ ADD THIS
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class ExamQuestion(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="questions")
    question_text = models.TextField()
    explanation = models.TextField(blank=True, null=True)


class ExamOption(models.Model):
    question = models.ForeignKey(ExamQuestion, on_delete=models.CASCADE, related_name="options")
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)


class ExamAttempt(models.Model):
    exam=models.ForeignKey(Exam,on_delete=models.CASCADE,related_name="attempts")
    user_id = models.IntegerField(null=True, blank=True)

    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)

    is_completed = models.BooleanField(default=False)

    score = models.FloatField(default=0)
    correct_count = models.IntegerField(default=0)
    wrong_count = models.IntegerField(default=0)


class ExamAttemptAnswer(models.Model):
    attempt = models.ForeignKey(ExamAttempt, on_delete=models.CASCADE, related_name="answers")
    question_id = models.IntegerField()
    selected_option_id = models.IntegerField()
    is_correct = models.BooleanField(default=False)

    answered_at = models.DateTimeField(auto_now=True)




# 🔥 SNAPSHOT SYSTEM (VERY IMPORTANT FOR REVIEW)
class ExamAttemptQuestionSnapshot(models.Model):
    attempt = models.ForeignKey(ExamAttempt, on_delete=models.CASCADE)

    question_id = models.IntegerField()
    question_text = models.TextField()

    correct_answer = models.TextField()



class ExamSnapshot(models.Model):

    topic = models.ForeignKey(
        Topic,
        on_delete=models.CASCADE
    )

    subtopic = models.ForeignKey(
        SubTopic,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    num_questions = models.IntegerField()
    difficulty = models.CharField(max_length=20)

    questions_json = models.JSONField()  # 🔥 store full MCQ set

    is_used = models.BooleanField(default=False)  # if already attempted

    created_at = models.DateTimeField(auto_now_add=True)    