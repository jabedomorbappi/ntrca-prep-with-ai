from django.urls import path
from .views import RegisterView, get_user_profile  # 👈 
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', get_user_profile, name='user-profile'),
]