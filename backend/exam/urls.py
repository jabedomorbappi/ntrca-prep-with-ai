from django.urls import path
from .views import (
    create_exam,
    start_exam,
    save_answer,
    submit_attempt,
    exam_detail,
    exam_history,
    exam_review,
    exam_analytics,
    subtopic_exam_status,
    get_exam_result,get_active_snapshot,request_password_reset
)
from .views import exam_snapshots
from . import views

urlpatterns = [
    path("generate/", create_exam, name="create_exam"),
    path("start/", start_exam, name="start_exam"), # Ensure this is unique
    path("save-answer/", save_answer, name="save_answer"),
    path("submit-attempt/", submit_attempt),
    path("detail/<int:exam_id>/", exam_detail, name="exam_detail"),
    path("history/", exam_history, name="exam_history"),
    path("stats/<int:attempt_id>/", exam_analytics, name="exam_stats"),
    path("subtopic-stats/<int:subtopic_id>/", subtopic_exam_status, name="subtopic_stats"),
    path("review/<int:attempt_id>/", exam_review, name="exam_review"),
    path("snapshots/<int:subtopic_id>/", exam_snapshots, name="exam_snapshots"),
    path("result/<int:attempt_id>/", get_exam_result),
    path('active-snapshot/<int:subtopic_id>/', get_active_snapshot, name='active-snapshot'),
    path('password-reset/', views.request_password_reset, name='request_password_reset'),
    path('password-reset-confirm/<str:uidb64>/<str:token>/', views.reset_password_confirm, name='reset_password_confirm'),


]