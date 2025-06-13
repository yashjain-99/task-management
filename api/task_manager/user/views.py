from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializer import UserRegistrationSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from datetime import datetime, timedelta
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class UserRegistrationView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "User registered successfully",
                "user_id": user.id
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == status.HTTP_200_OK:
            access_token = response.data['access']
            refresh_token = response.data['refresh']
            
            # Set refresh token in HTTP-only cookie
            expires = datetime.now() + timedelta(seconds=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds())
            
            response.set_cookie(
                key=settings.SIMPLE_JWT['REFRESH_TOKEN_COOKIE_NAME'],
                value=refresh_token,
                expires=expires,
                httponly=True,
                secure=settings.SIMPLE_JWT['COOKIE_SECURE'],
                samesite=settings.SIMPLE_JWT['COOKIE_SAMESITE'],
                path=settings.SIMPLE_JWT['REFRESH_TOKEN_COOKIE_PATH']
            )
            
            # Remove refresh token from response body
            del response.data['refresh']
        
        return response


class UserTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        # Get refresh token from cookie
        refresh_token = request.COOKIES.get(
            settings.SIMPLE_JWT['REFRESH_TOKEN_COOKIE_NAME']
        )
        
        if not refresh_token:
            return Response(
                {'detail': 'Refresh token not found in cookie'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Set refresh token in request data
        request.data['refresh'] = refresh_token
        return super().post(request, *args, **kwargs)

class UserLogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.COOKIES.get(
            settings.SIMPLE_JWT['REFRESH_TOKEN_COOKIE_NAME']
        )
        response = Response({'detail': 'Successfully logged out'})

        response.delete_cookie(
            key=settings.SIMPLE_JWT['REFRESH_TOKEN_COOKIE_NAME'],
            path=settings.SIMPLE_JWT['REFRESH_TOKEN_COOKIE_PATH']
        )

        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
                print("Token blacklisted successfully.")
            except Exception:
                print("Error blacklisting token, it may be invalid or blacklisting is not enabled.")
                pass  # Ignore errors if token is invalid or blacklisting is not enabled

        return response