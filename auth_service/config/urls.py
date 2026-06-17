from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import ( TokenObtainPairView, TokenRefreshView,)

urlpatterns = [
    path('admin/', admin.site.urls),
    # Point d'entrée pour se connecter et obtenir le Token JWT
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # Point d'entrée pour rafraîchir le Token quand il expire
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]