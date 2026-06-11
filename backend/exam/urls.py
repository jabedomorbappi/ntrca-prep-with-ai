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
    get_exam_result,get_active_snapshot
)
from .views import exam_snapshots
from . import views

urlpatterns = [
    # =========================
    # EXAM GENERATION
    # =========================
    path("generate/", create_exam, name="create_exam"),

    # =========================
    # EXAM LIFECYCLE
    # =========================
    path("start/", start_exam, name="start_exam"),
    path("save-answer/", save_answer, name="save_answer"),
    path("submit-attempt/", submit_attempt),

    # =========================
    # EXAM DATA
    # =========================
    path("detail/<int:exam_id>/", exam_detail, name="exam_detail"),

    # =========================
    # ANALYTICS / HISTORY
    # =========================
    path("history/", exam_history, name="exam_history"),
    path("stats/<int:attempt_id>/", exam_analytics, name="exam_stats"),
    path("subtopic-stats/<int:subtopic_id>/", subtopic_exam_status, name="subtopic_stats"), # ADD THIS
    # =========================
    # REVIEW SYSTEM (BCS STYLE)
    # =========================
    path("review/<int:attempt_id>/", exam_review, name="exam_review"),
 

    path("snapshots/<int:subtopic_id>/",exam_snapshots,name="exam_snapshots"),
    # Add this line
    # To this:
path("subtopic-stats/<int:subtopic_id>/", views.subtopic_exam_status, name="subtopic_stats"),
    path("result/<int:attempt_id>/", get_exam_result),
    path('active-snapshot/<int:subtopic_id>/', views.get_active_snapshot, name='active-snapshot'),

]