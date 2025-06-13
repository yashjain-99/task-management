from django.urls import path
from .views import TaskListCreateView, TaskRetrieveUpdateDestroyView, TashExportView, BulkUploadTasksView

urlpatterns = [
    path('tasks/', TaskListCreateView.as_view()),
    path('tasks/<int:pk>/', TaskRetrieveUpdateDestroyView.as_view()),
    path('export/', TashExportView.as_view()),
    path('bulk_upload/', BulkUploadTasksView.as_view()),
]