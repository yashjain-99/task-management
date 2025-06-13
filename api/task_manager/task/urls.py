from django.urls import path
from .views import TaskListCreateView, TaskRetrieveUpdateDestroyView, TashExportView

urlpatterns = [
    path('tasks/', TaskListCreateView.as_view()),
    path('tasks/<int:pk>/', TaskRetrieveUpdateDestroyView.as_view()),
    path('export/', TashExportView.as_view()),
]