import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

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
    # Tout est intercepté dynamiquement par **extra_fields pour s'adapter à USERNAME_FIELD
    def create_user(self, password=None, **extra_fields):
        # On récupère le nom exact du champ défini par USERNAME_FIELD dans le modèle
        champ_identifiant = self.model.USERNAME_FIELD
        
        if not extra_fields.get(champ_identifiant):
            raise ValueError(f"Le champ {champ_identifiant} est obligatoire.")
        
        user = self.model(**extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, password=None, **extra_fields):
        # On force les droits d'administration requis par Django
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError("Un superutilisateur doit avoir is_staff=True.")
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("Un superutilisateur doit avoir is_superuser=True.")

        # On transfère le tout à create_user
        return self.create_user(password=password, **extra_fields)

# Héritage de AbstractBaseUser ET de PermissionsMixin (ajoute is_superuser et la gestion des droits)
class T_Utilisateur(AbstractBaseUser, PermissionsMixin):
    U_id = models.CharField(primary_key=True, default=uuid.uuid4, max_length=50, editable=False)
    U_nom = models.CharField(max_length=100)
    U_prenom = models.CharField(max_length=100)
    U_login = models.CharField(max_length=150, unique=True)
    
    # Champs d'état requis pour l'administration Django
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Relation : Un Utilisateur appartient à un ou plusieurs Groupes
    groupes = models.ManyToManyField(T_GroupeUtilisateur, related_name='utilisateurs')
    
    # Référence externe : T_Agence (située dans queue_service)
    Agc_id = models.CharField(max_length=50, null=True, blank=True)

    objects = T_UtilisateurManager()

    USERNAME_FIELD = 'U_login'

    def authentifier(self):
        pass # Implémentation métier future

    def seDeconnecter(self):
        pass # Implémentation métier future

    def __str__(self):
        return f"{self.U_prenom} {self.U_nom}"