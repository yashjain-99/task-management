from django.urls import path
from .views import UserRegistrationView, UserLoginView, UserTokenRefreshView, UserLogoutView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-register'),
     path('login/', UserLoginView.as_view(), name='token_obtain_pair'),
    path('refresh/', UserTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', UserLogoutView.as_view(), name='logout'),
]