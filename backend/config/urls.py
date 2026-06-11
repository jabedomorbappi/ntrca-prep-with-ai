
from django.contrib import admin
from django.urls import path,include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/exam/", include("exam.urls")),
    path("api/syllabus/", include("syllabus.urls")),
    path('api/study/', include('question_bank.urls')),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # অন্যান্য অ্যাপের ইউআরএল
    path('api/accounts/', include('accounts.urls')),
]
