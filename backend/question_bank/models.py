from django.db import models
from syllabus.models import Topic, SubTopic


class Question(models.Model):

    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    subtopic = models.ForeignKey(SubTopic, on_delete=models.CASCADE, null=True, blank=True)

    question_text = models.TextField()

    explanation = models.TextField(blank=True, null=True)

    difficulty = models.CharField(
        max_length=10,
        choices=[("easy","Easy"), ("medium","Medium"), ("hard","Hard")],
        default="easy"
    )

    created_at = models.DateTimeField(auto_now_add=True)


class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="options")

    text = models.CharField(max_length=255)

    is_correct = models.BooleanField(default=False)

from django.db import models
from syllabus.models import Topic, SubTopic


from django.db import models
from syllabus.models import Topic, SubTopic


class QuestionBank(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    subtopic = models.ForeignKey(SubTopic, on_delete=models.CASCADE, null=True, blank=True)

    question_text = models.TextField()
    explanation = models.TextField(blank=True, null=True)
    source = models.CharField(max_length=50, default="gemini") # ai / manual
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # This prevents duplicate questions for the same subtopic
        unique_together = ('subtopic', 'question_text')

class QuestionBankOption(models.Model):
    question = models.ForeignKey(QuestionBank, on_delete=models.CASCADE, related_name="options")
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)