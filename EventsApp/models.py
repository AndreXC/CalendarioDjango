# calendar_app/models.py

from django.db import models
from django.contrib.auth.models import User

class Event(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')
    title = models.CharField(max_length=255)
    creator_name = models.CharField(max_length=255)
    event_date = models.DateTimeField()
    description = models.TextField(blank=True, null=True)
    color = models.CharField(max_length=7, default='#3b82f6')
    STATUS_CHOICES = [('pending', 'Pendente'), ('completed', 'Concluído')]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"'{self.title}' por {self.user.username}"
    
    
    