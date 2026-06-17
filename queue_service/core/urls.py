# core/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceCategoryViewSet, CounterViewSet, TicketViewSet

# Le routeur génère automatiquement les URLs pour les opérations CRUD classiques
router = DefaultRouter()
router.register(r'categories', ServiceCategoryViewSet)
router.register(r'counters', CounterViewSet)
router.register(r'tickets', TicketViewSet)

urlpatterns = [
    path('', include(router.urls)),
]