from rest_framework import serializers
from core.models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'effort_days', 'due_date']
    
    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError("Title cannot be empty")
        return value