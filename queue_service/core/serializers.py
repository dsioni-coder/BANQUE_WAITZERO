# core/serializers.py
from rest_framework import serializers
from .models import ServiceCategory, Counter, Ticket

class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = '__all__'

class CounterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Counter
        fields = '__all__'

class TicketSerializer(serializers.ModelSerializer):
    # Ajout de champs calculés pour faciliter l'affichage côté Next.js
    category_name = serializers.CharField(source='category.name', read_only=True)
    counter_number = serializers.IntegerField(source='counter.number', read_only=True)

    class Meta:
        model = Ticket
        fields = '__all__'
        # Le frontend n'a pas le droit de modifier ces champs manuellement
        read_only_fields = [
            'ticket_number', 'status', 'issued_at', 
            'called_at', 'completed_at', 'agent_id', 'counter'
        ]