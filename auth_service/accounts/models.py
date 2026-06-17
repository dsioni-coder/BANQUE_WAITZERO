import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # Remplacement de l'ID classique par un UUID (sécurité et distribution)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # On force l'email à être unique, il servira d'identifiant de connexion
    email = models.EmailField(unique=True)
    
    # Rôle de l'utilisateur dans l'agence
    ROLE_CHOICES = (
        ('AGENT', 'Agent de Guichet'),
        ('MANAGER', 'Chef d\'Agence'),
        ('ADMIN', 'Administrateur IT'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='AGENT')

    def __str__(self):
        return f"{self.email} - {self.get_role_display()}"