import logging
from django.core.management.base import BaseCommand
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.interval import IntervalTrigger
from sync_tracker.services import perform_hourly_sync
from django.utils import timezone  # NOUVEAU : Ajout de l'import timezone

# Configuration du logger pour avoir des traces propres dans Docker
logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = "Démarre le planificateur de tâches pour la synchronisation avec la Banque Centrale."

    def handle(self, *args, **options):
        # Utilisation de BlockingScheduler car ce conteneur ne fera QUE ça
        scheduler = BlockingScheduler(timezone="UTC")

        # NOUVEAU : Affichage forcé dans la console Docker
        self.stdout.write(self.style.SUCCESS("Configuration du Scheduler en cours..."))

        # 1. Ajout de la tâche métier
        scheduler.add_job(
            perform_hourly_sync,
            trigger=IntervalTrigger(hours=1),
            id="sync_centrale_horaire",
            max_instances=1,
            replace_existing=True,
            misfire_grace_time=900, # Autorise jusqu'à 15 minutes (900s) de retard
            coalesce=True,          # Ne lance qu'une seule synchro au réveil pour rattraper
            next_run_time=timezone.now(), # NOUVEAU : Force la première exécution IMMÉDIATEMENT
        )

        # NOUVEAU : Affichage forcé
        self.stdout.write(self.style.SUCCESS("Démarrage du Scheduler... (Première exécution immédiate, puis toutes les heures)"))

        try:
            # 2. Lancement de la boucle infinie
            scheduler.start()
        except KeyboardInterrupt:
            # 3. Gestion propre de l'arrêt (Graceful Shutdown)
            self.stdout.write(self.style.WARNING("Signal d'arrêt reçu. Fermeture du Scheduler..."))
            scheduler.shutdown()
            self.stdout.write(self.style.SUCCESS("Scheduler arrêté avec succès."))