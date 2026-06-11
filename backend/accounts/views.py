from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .serializers import RegisterSerializer

class RegisterView(generics.CreateAPIView):
    """
    Handles student registration by collecting username, email, and password.
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"message": "user have created successfully!"}, 
            status=status.HTTP_201_CREATED
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """
    Returns the account details of the active logged-in student session.
    """
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email
    }, status=status.HTTP_200_OK)