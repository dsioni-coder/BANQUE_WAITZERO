# urls.py
from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import T_UtilisateurTokenView # 👈 Import de votre vue perso

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # On utilise maintenant notre vue customisée !
    path('api/auth/login/', T_UtilisateurTokenView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]