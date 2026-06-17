import uuid
from django.db import models

class ServiceCategory(models.Model):
    """Catégories de services proposés par l'agence (ex: Dépôt, Retrait, Conseil)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    prefix = models.CharField(max_length=5, help_text="Ex: DEP, RET")

    def __str__(self):
        return self.name

class Counter(models.Model):
    """Les guichets physiques présents dans l'agence"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    number = models.IntegerField(unique=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Guichet {self.number}"

class Ticket(models.Model):
    """Le ticket de file d'attente lui-même"""
    STATUS_CHOICES = (
        ('WAITING', 'En attente'),
        ('CALLED', 'Appelé'),
        ('SERVING', 'En cours de traitement'),
        ('COMPLETED', 'Terminé'),
        ('ABANDONED', 'Abandonné'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey(ServiceCategory, on_delete=models.CASCADE)
    ticket_number = models.CharField(max_length=20) # Ex: RET-042
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='WAITING')
    
    # Horodatages pour les statistiques (vitaux pour le futur sync_service)
    issued_at = models.DateTimeField(auto_now_add=True)
    called_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Affectations
    counter = models.ForeignKey(Counter, on_delete=models.SET_NULL, null=True, blank=True)
    
    # ID de l'agent issu du Token JWT. 
    # Ce n'est PAS une ForeignKey car l'utilisateur vit dans une autre base de données !
    agent_id = models.UUIDField(null=True, blank=True)

    class Meta:
        ordering = ['issued_at'] # On traite les plus anciens en premier

    def __str__(self):
        return f"{self.ticket_number} - {self.status}"