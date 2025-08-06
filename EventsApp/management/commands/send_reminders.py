from django.core.management.base import BaseCommand
from django.utils import timezone
from django.core.mail import send_mail
from django.template.loader import render_to_string
from datetime import timedelta
from EventsApp.models import Event 
from dotenv import load_dotenv
import os

def format_time_remaining(time_delta):
    """Converte um timedelta em uma string amigável."""
    seconds = time_delta.total_seconds()
    hours = seconds / 3600
    minutes = seconds / 60
    if hours >= 22: return "amanhã"
    if hours >= 1: return f"em aproximadamente {round(hours)} horas"
    if minutes >= 1: return f"em {round(minutes)} minutos"
    return "em breve"

class Command(BaseCommand):
    help = 'Verifica eventos próximos (nas próximas 24h) e envia e-mails de lembrete.'

    def handle(self, *args, **options):
        now = timezone.now()
        in_24_hours = now + timedelta(hours=24)

        self.stdout.write(f"--- Verificando eventos entre {now.strftime('%H:%M')} e {in_24_hours.strftime('%H:%M de amanhã')} ---")
        
        upcoming_events = Event.objects.filter(
            event_date__gte=now,
            event_date__lte=in_24_hours,
            status='pending'
        )

        if not upcoming_events:
            self.stdout.write(self.style.SUCCESS("Nenhum evento encontrado nas próximas 24 horas."))
            return

        self.stdout.write(f"Eventos encontrados: {upcoming_events.count()}")
        
        load_dotenv()
        
        recipient_list =[
            os.getenv('EMAIL_Andre'),
            os.getenv('EMAIL_Raquel'),
        ]

        for event in upcoming_events:
            time_remaining_str = format_time_remaining(event.event_date - now)

            context = {
                'event': event,
                'time_remaining': time_remaining_str,
            }
            html_message = render_to_string('email/reminder.html', context)
            
            subject = f"Lembrete: Seu evento '{event.title}' está chegando!"
            
            try:
                send_mail(
                    subject=subject,
                    message='',
                    from_email=None, 
                    recipient_list=recipient_list,
                    html_message=html_message,
                    fail_silently=False,
                )
                self.stdout.write(self.style.SUCCESS(f"✅ Lembrete para '{event.title}' enviado com sucesso!"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"❌ Falha ao enviar e-mail para '{event.title}'. Erro: {e}"))

        self.stdout.write("--- Verificação concluída ---")