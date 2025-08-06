from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
     # Rotas de PÁGINAS
    path('', views.calendar_view, name='calendar'),
    path('login/', auth_views.LoginView.as_view(template_name='login/login.html',redirect_authenticated_user=True), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('register/', views.RegisterView.as_view(), name='register'),
    
    # Rotas da API (prefixadas com /api/)
    path('api/events/', views.EventListCreateView.as_view(), name='api-event-list-create'),
    path('api/events/<int:pk>/', views.EventRetrieveUpdateDestroyView.as_view(), name='api-event-detail'),
]