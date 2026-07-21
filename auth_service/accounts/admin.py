# accounts/admin.py
from django.contrib import admin
from .models import T_Utilisateur, T_GroupeUtilisateur, T_Permission, T_Fonctionnalite

@admin.register(T_Utilisateur)
class T_UtilisateurAdmin(admin.ModelAdmin):
    # Les colonnes qui s'afficheront dans la liste des utilisateurs
    list_display = ('U_login', 'U_prenom', 'U_nom', 'is_active', 'is_staff')
    search_fields = ('U_login', 'U_prenom', 'U_nom')
    
    # Interface pratique (deux colonnes) pour sélectionner les groupes
    filter_horizontal = ('groupes', 'groups', 'user_permissions') 

@admin.register(T_GroupeUtilisateur)
class T_GroupeUtilisateurAdmin(admin.ModelAdmin):
    list_display = ('GU_nom', 'GU_description')
    filter_horizontal = ('permissions',)

@admin.register(T_Permission)
class T_PermissionAdmin(admin.ModelAdmin):
    list_display = ('P_description',)
    filter_horizontal = ('fonctionnalites',)

@admin.register(T_Fonctionnalite)
class T_FonctionnaliteAdmin(admin.ModelAdmin):
    list_display = ('F_code', 'F_niveau')