# accounts/serializers.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class T_UtilisateurTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # 👉 On injecte nos données métier UML dans le jeton décodé
        token['nom'] = user.U_nom
        token['prenom'] = user.U_prenom
        token['login'] = user.U_login
        
        # Récupération des rôles (groupes) de l'utilisateur
        token['groupes'] = list(user.groupes.values_list('GU_nom', flat=True))

        return token