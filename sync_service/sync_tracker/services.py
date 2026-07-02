import requests
from django.conf import settings
from .models import SyncHistory

def perform_hourly_sync():
    """
    Exécute le cycle de synchronisation vers la Banque Centrale.
    """
    # 1. Création de la trace dans l'historique (Statut PENDING par défaut)
    sync_record = SyncHistory.objects.create()
    
    try:
        # 2. (Simulation) Extraction des données depuis les tables locales
        # Ici, vous ferez vos requêtes SQL ou ORM pour récupérer les tickets de la dernière heure
        donnees_a_envoyer = {
            "agence_id": "AG-001",
            "tickets_servis": 42,
            "temps_attente_moyen_minutes": 15
        }
        
        # 3. Envoi vers le référentiel de la Banque Centrale
        # (URL fictive pour l'instant, à remplacer par la vraie API)
        url_banque_centrale = "https://api.banquecentrale.local/v1/sync/stats"
        
        reponse = requests.post(
            url_banque_centrale, 
            json=donnees_a_envoyer,
            timeout=10 # Règle d'or : toujours mettre un timeout sur un appel réseau
        )
        
        # Lève une exception automatique si le code HTTP est une erreur (4xx ou 5xx)
        reponse.raise_for_status() 
        
        # 4. Si tout s'est bien passé, on clôture la trace en SUCCÈS
        sync_record.mark_as_success(records_count=donnees_a_envoyer["tickets_servis"])
        print(f"[{sync_record.start_time}] Succès : {donnees_a_envoyer['tickets_servis']} tickets synchronisés.")

    except requests.exceptions.RequestException as e:
        # 5. Si la Banque Centrale est injoignable, on trace l'ERREUR
        error_msg = f"Erreur réseau / API : {str(e)}"
        sync_record.mark_as_failed(error_log=error_msg)
        print(f"[{sync_record.start_time}] Échec de la synchronisation : {error_msg}")
        
    except Exception as e:
        # Capture de toute autre erreur inattendue (ex: base de données locale)
        error_msg = f"Erreur système inattendue : {str(e)}"
        sync_record.mark_as_failed(error_log=error_msg)
        print(f"[{sync_record.start_time}] Erreur critique : {error_msg}")