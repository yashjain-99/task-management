from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    effort_days = models.PositiveIntegerField()  # Effort in days
    due_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)