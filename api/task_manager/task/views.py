from rest_framework import generics, permissions
from core.models import Task
from .serializer import TaskSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
import pandas as pd
from io import BytesIO
from django.http import HttpResponse
from rest_framework.parsers import MultiPartParser
from rest_framework import status

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TaskRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

class TashExportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        tasks = Task.objects.filter(user=request.user)
        df = pd.DataFrame(list(tasks.values(
            'title', 'description', 'effort_days', 'due_date'
        )))
        output = BytesIO()
        df.to_excel(output, index=False, engine='openpyxl')
        output.seek(0)
        response = HttpResponse(
            output.read(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename=tasks.xlsx'
        return response

class BulkUploadTasksView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request):
        file = request.FILES.get("file")
        if not file:
            return Response({"error": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            df = pd.read_excel(file)
            required_columns = {"title", "description", "effort_days", "due_date"}
            if not required_columns.issubset(df.columns):
                return Response(
                    {"error": f"Missing columns. Required: {', '.join(required_columns)}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            created = 0
            for _, row in df.iterrows():
                Task.objects.create(
                    user=request.user,
                    title=row["title"],
                    description=row.get("description", ""),
                    effort_days=int(row["effort_days"]),
                    due_date=row["due_date"],
                )
                created += 1
            return Response({"message": f"{created} tasks uploaded successfully."})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)