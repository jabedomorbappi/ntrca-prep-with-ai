from django.contrib import admin

# Register your models here.


from django.contrib import admin
from .models import Exam, ExamQuestion, ExamOption, ExamAttempt, ExamAttemptAnswer, ExamSnapshot

# 🎯 Register all your exam structures so you can manage them in the admin dashboard
admin.site.register(Exam)
admin.site.register(ExamQuestion)
admin.site.register(ExamOption)
admin.site.register(ExamAttempt)
admin.site.register(ExamAttemptAnswer)
admin.site.register(ExamSnapshot)