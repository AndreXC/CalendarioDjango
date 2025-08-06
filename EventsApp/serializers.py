# calendar_app/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Event

# ... (código dos serializers UserSerializer e EventSerializer da resposta anterior) ...
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}
    def create(self, validated_data):
        user = User.objects.create_user(username=validated_data['username'], email=validated_data['email'], password=validated_data['password'])
        return user

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'creator_name', 'event_date', 'description', 'color', 'status']