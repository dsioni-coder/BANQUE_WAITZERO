import uuid
from django.db import models
from django.utils import timezone


class SyncHistory(models.Model):
    class SyncStatus(models.TextChoices):
        PENDING = 'PENDING', 'En cours'
        SUCCESS = 'SUCCESS', 'Succès'
        FAILED = 'FAILED', 'Échec'
        PARTIAL = 'PARTIAL', 'Succès partiel'
    
    #Identifiant unique de la transaction (clé primaire non prédictible)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
   
    # Horodatage précis
    start_time = models.DateTimeField(default=timezone.now, verbose_name="Debut de la synchronisation")
    end_time = models.DateTimeField(null=True, blank=True, verbose_name="Fin de la synchronisation")
    
    # Statut du cycle de synchronisation
    status = models.CharField(
        max_length=15,
        choices=SyncStatus.choices,
        default=SyncStatus.PENDING,
        verbose_name="Statut"
    )
    
    # Métriques de volume pour les rapports de performance
    records_processed = models.IntegerField(
        default=0,
        verbose_name="Nombre de tickets traités")
    
    # Traçabilité technique en cas d'anomalie
    error_message = models.TextField(
        null=True,
        blank=True,
        verbose_name="Rapport d'erreur / Stacktrace"
    )
    
   # Gestion de la résilience (stratégie de rejeu) 
    attempt_number = models.PositiveIntegerField(
        default=1,
        verbose_name="Numéro de tentative"
   )
   
    class Meta:
        verbose_name = "Historique de synchronisation"
        verbose_name_plural = "Historiques de synchronisation"
        ordering = ['-start_time']
    
    def __str__(self):
        return f"Sync {self.id} - {self.status} ({self.start_time.strftime('%Y-%m-%d %H:%M:%S')})"
    
    @property
    def duration(self):
        """Calcule la durée d'exécution en secondes."""
        if self.end_time:
            return (self.end_time - self.start_time).total_seconds()
        return None
    
    def mark_as_success(self, records_count):
        """Clôture la synchronisation en succès."""
        self.status = self.SyncStatus.SUCCESS
        self.records_processed = records_count
        self.save()
    
    def mark_as_failed(self, error_log):
        """Clôture la synchronisation en échec avec sauvegarde du log."""
        self.status = self.SyncStatus.FAILED
        self.error_message = error_log
        self.end_time = timezone.now()
        self.save()