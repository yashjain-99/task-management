from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path
from .views import TaskListCreateView, TaskRetrieveUpdateDestroyView

urlpatterns = [
    path('tasks/', TaskListCreateView.as_view()),
    path('tasks/<int:pk>/', TaskRetrieveUpdateDestroyView.as_view())
]