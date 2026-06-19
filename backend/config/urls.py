from django.contrib import admin
from django.urls import path, include
# from django.contrib.auth import views as auth_views
from django.http import HttpResponse

def home_view(request):
    return HttpResponse("Welcome to the NTRCA Prep AI API!")

urlpatterns = [
    path('', home_view),
    path('admin/', admin.site.urls),
    
    # Keep your app-specific routes
    path("api/exam/", include("exam.urls")),
    path("api/syllabus/", include("syllabus.urls")),
    path('api/study/', include('question_bank.urls')),
    path('api/accounts/', include('accounts.urls')),

    # ❌ REMOVE THESE LINES:
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Password reset paths (Keep if you still need user account management, 
    # but ensure these views don't require JWT authentication)
#     path('password-reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    # ... keep the other password reset paths
]