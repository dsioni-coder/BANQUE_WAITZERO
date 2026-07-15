import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

# ==========================================
# GESTION DES DROITS (STRICTEMENT SELON UML)
# ==========================================

class T_Fonctionnalite(models.Model):
    F_id = models.CharField(primary_key=True, default=uuid.uuid4, max_length=50, editable=False)
    F_code = models.CharField(max_length=50, unique=True)
    F_niveau = models.CharField(max_length=50)

    def verifierAcces(self):
        pass # Implémentation métier future

    def __str__(self):
        return self.F_code

class T_Permission(models.Model):
    # La clé primaire technique implicite (id) est gérée par Django, 
    # mais l'UML liste P_description.
    P_description = models.CharField(max_length=255)
    
    # Relation : 1 Permission contient 1..* Fonctionnalités
    fonctionnalites = models.ManyToManyField(T_Fonctionnalite, related_name='permissions')

    def __str__(self):
        return self.P_description

class T_GroupeUtilisateur(models.Model):
    GU_id = models.CharField(primary_key=True, default=uuid.uuid4, max_length=50, editable=False)
    GU_nom = models.CharField(max_length=100, unique=True)
    GU_description = models.CharField(max_length=255, blank=True, null=True)
    
    # Relation : 1 Groupe octroie 1..* Permissions
    permissions = models.ManyToManyField(T_Permission, related_name='groupes')

    def __str__(self):
        return self.GU_nom

# ==========================================
# UTILISATEUR & MANAGER POUR DJANGO
# ==========================================

class T_UtilisateurManager(BaseUserManager):
    def create_user(self, U_login, U_motDePasse=None, **extra_fields):
        if not U_login:
            raise ValueError('Le login est obligatoire')
        user = self.model(U_login=U_login, **extra_fields)
        user.set_password(U_motDePasse) # Gère le hachage sécurisé du mot de passe
        user.save(using=self._db)
        return user

class T_Utilisateur(AbstractBaseUser):
    U_id = models.CharField(primary_key=True, default=uuid.uuid4, max_length=50, editable=False)
    U_nom = models.CharField(max_length=100)
    U_prenom = models.CharField(max_length=100)
    U_login = models.CharField(max_length=150, unique=True)
    
    # U_motDePasse : Django le gère nativement via le champ 'password' de AbstractBaseUser,
    # mais nous respectons votre logique métier.
    
    # Relation : Un Utilisateur appartient à un ou plusieurs Groupes (selon diagramme 1..* vers 1..*)
    groupes = models.ManyToManyField(T_GroupeUtilisateur, related_name='utilisateurs')
    
    # Référence externe : T_Agence (qui se trouve dans queue_service)
    # C'est la ligne "emploie" du diagramme
    Agc_id = models.CharField(max_length=50, null=True, blank=True)

    objects = T_UtilisateurManager()

    USERNAME_FIELD = 'U_login'

    def authentifier(self):
        pass # Implémentation métier

    def seDeconnecter(self):
        pass # Implémentation métier

    def __str__(self):
        return f"{self.U_prenom} {self.U_nom}"