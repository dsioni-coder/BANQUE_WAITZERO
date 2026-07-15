from django.contrib import admin
from .models import T_Utilisateur, T_GroupeUtilisateur, T_Permission, T_Fonctionnalite

admin.site.register(T_Utilisateur)
admin.site.register(T_GroupeUtilisateur)
admin.site.register(T_Permission)
admin.site.register(T_Fonctionnalite)