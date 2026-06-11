from django.contrib import admin
from .models import Question, Option


class OptionInline(admin.TabularInline):
    model = Option
    extra = 4


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("question_text", "difficulty", "topic", "subtopic")
    inlines = [OptionInline]