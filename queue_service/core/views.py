# core/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import ServiceCategory, Counter, Ticket
from .serializers import ServiceCategorySerializer, CounterSerializer, TicketSerializer

class ServiceCategoryViewSet(viewsets.ModelViewSet):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer

class CounterViewSet(viewsets.ModelViewSet):
    queryset = Counter.objects.all()
    serializer_class = CounterSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

    def perform_create(self, serializer):
        """
        Intercepte la création du ticket pour générer un numéro logique 
        (ex: RET-001, DEP-042) basé sur la catégorie et le nombre du jour.
        """
        category = serializer.validated_data['category']
        # Compter le nombre de tickets créés aujourd'hui pour cette catégorie
        today_start = timezone.now().replace(hour=0, minute=0, second=0)
        count = Ticket.objects.filter(category=category, issued_at__gte=today_start).count()
        
        ticket_number = f"{category.prefix}-{count + 1:03d}"
        serializer.save(ticket_number=ticket_number)

    @action(detail=True, methods=['post'])
    def call(self, request, pk=None):
        """Endpoint pour qu'un agent appelle le ticket à son guichet."""
        ticket = self.get_object()
        counter_id = request.data.get('counter_id')
        
        # Extraction de l'ID de l'agent depuis le JWT fourni par l'auth_service
        agent_id = request.auth.payload.get('user_id') if request.auth else None

        if ticket.status != 'WAITING':
            return Response({"detail": "Ce ticket n'est plus en attente."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            counter = Counter.objects.get(id=counter_id)
        except Counter.DoesNotExist:
            return Response({"detail": "Guichet invalide."}, status=status.HTTP_400_BAD_REQUEST)

        # Mise à jour des états
        ticket.status = 'CALLED'
        ticket.called_at = timezone.now()
        ticket.counter = counter
        ticket.agent_id = agent_id
        ticket.save()
        
        return Response(TicketSerializer(ticket).data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Endpoint pour clôturer l'opération."""
        ticket = self.get_object()
        
        if ticket.status not in ['CALLED', 'SERVING']:
            return Response({"detail": "Statut invalide pour terminer l'opération."}, status=status.HTTP_400_BAD_REQUEST)
        
        ticket.status = 'COMPLETED'
        ticket.completed_at = timezone.now()
        ticket.save()
        
        return Response(TicketSerializer(ticket).data)