# from django.shortcuts import render

# # Create your views here.
# # core/views.py

# from django.shortcuts import render

# def home(request):
#     return render(request, 'Dash/index.html')



# calendar_app/views.py

from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login
from django.views.generic import CreateView
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.urls import reverse_lazy

from rest_framework import generics, permissions
from .models import Event
from .serializers import EventSerializer

# --- Views que Renderizam PÁGINAS HTML ---

@login_required # Protege a página: só usuários logados podem ver
def calendar_view(request):
    """Serve a página principal do calendário (index.html)."""
    return render(request, 'Dash/index.html')

class RegisterView(CreateView):
    """View para a página de registro."""
    model = User
    form_class = UserCreationForm
    template_name = 'register/register.html'
    success_url = reverse_lazy('login') # Redireciona para o login após registrar

# --- Views da API (DRF) ---
# Essas são as views que o seu JavaScript vai chamar

class EventListCreateView(generics.ListCreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(user=self.request.user).order_by('event_date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class EventRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(user=self.request.user)