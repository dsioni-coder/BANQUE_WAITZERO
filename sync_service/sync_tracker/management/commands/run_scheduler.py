import logging
from django.core.management.base import BaseCommand
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.interval import IntervalTrigger
from sync_tracker.services import perform_hourly_sync

# Configuration du logger pour avoir des traces propres dans Docker
logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = "Démarre le planificateur de tâches pour la synchronisation avec la Banque Centrale."

    def handle(self, *args, **options):
        # Utilisation de BlockingScheduler car ce conteneur ne fera QUE ça
        scheduler = BlockingScheduler(timezone="UTC")

        # 1. Ajout de la tâche métier
        scheduler.add_job(
            perform_hourly_sync,
            trigger=IntervalTrigger(hours=1),
            id="sync_centrale_horaire",
            max_instances=1,
            replace_existing=True,
            misfire_grace_time=900, # NOUVEAU : Autorise jusqu'à 15 minutes (900s) de retard
            coalesce=True,          # NOUVEAU : Si le conteneur était éteint pendant 3h, ne lance qu'une seule synchro au réveil pour rattraper, au lieu de 3 d'un coup.
        )

        logger.info("Démarrage du Scheduler... (Tâche programmée toutes les heures)")

        try:
            # 2. Lancement de la boucle infinie
            scheduler.start()
        except KeyboardInterrupt:
            # 3. Gestion propre de l'arrêt (Graceful Shutdown)
            logger.info("Signal d'arrêt reçu. Fermeture du Scheduler...")
            scheduler.shutdown()
            logger.info("Scheduler arrêté avec succès.")