# accounts/views.py
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import T_UtilisateurTokenSerializer

class T_UtilisateurTokenView(TokenObtainPairView):
    serializer_class = T_UtilisateurTokenSerializer