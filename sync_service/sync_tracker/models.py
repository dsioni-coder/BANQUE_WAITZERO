import uuid
from django.db import models

class T_Banque(models.Model):
    Bnq_id = models.CharField(primary_key=True, default=uuid.uuid4, max_length=50, editable=False)
    Bnq_nom = models.CharField(max_length=100)
    Bnq_code = models.CharField(max_length=20, unique=True)
    Bnq_siegeSocial = models.CharField(max_length=255)

    def ajouterAgence(self):
        pass

    def consulterStatistiqueGlobales(self):
        pass

    def __str__(self):
        return self.Bnq_nom

class T_Agence(models.Model):
    Agc_id = models.CharField(primary_key=True, default=uuid.uuid4, max_length=50, editable=False)
    banque = models.ForeignKey(T_Banque, on_delete=models.CASCADE, related_name='agences')
    Agc_nom = models.CharField(max_length=100)
    Agc_adresse = models.CharField(max_length=255)
    Agc_statut = models.CharField(max_length=50) # StatutAgence
    Agc_synchronisationActive = models.BooleanField(default=True)

    def ouvrir(self):
        pass
        
    def fermer(self):
        pass
        
    def configurerServices(self):
        pass

    def __str__(self):
        return self.Agc_nom

class T_ServiceMetier(models.Model):
    SM_id = models.CharField(primary_key=True, default=uuid.uuid4, max_length=50, editable=False)
    SM_nom = models.CharField(max_length=100)
    SM_description = models.CharField(max_length=255)

    def __str__(self):
        return self.SM_nom

class T_File(models.Model):
    FI_id = models.CharField(primary_key=True, default=uuid.uuid4, max_length=50, editable=False)
    service_metier = models.ForeignKey(T_ServiceMetier, on_delete=models.CASCADE, related_name='files')
    FI_code = models.CharField(max_length=20)
    FI_nom = models.CharField(max_length=100)
    FI_priorite = models.IntegerField(default=0)
    FI_statut = models.CharField(max_length=50) # StatutFile

    def ouvrir(self):
        pass
        
    def fermer(self):
        pass
        
    def obtenirNombreAttente(self):
        return self.tickets.filter(T_statut="EnAttente").count()

    def __str__(self):
        return self.FI_nom

class T_Ticket(models.Model):
    T_id = models.CharField(primary_key=True, default=uuid.uuid4, max_length=50, editable=False)
    file_attente = models.ForeignKey(T_File, on_delete=models.CASCADE, related_name='tickets')
    T_numero = models.IntegerField()
    T_dateEmission = models.DateTimeField(auto_now_add=True)
    T_priorite = models.IntegerField(default=0)
    T_statut = models.CharField(max_length=50) # StatutTicket

    def appeler(self):
        pass
        
    def transfere(self, file_cible):
        pass

    def __str__(self):
        return str(self.T_numero)

class T_Guichet(models.Model):
    G_id = models.CharField(primary_key=True, default=uuid.uuid4, max_length=50, editable=False)
    agence = models.ForeignKey(T_Agence, on_delete=models.CASCADE, related_name='guichets')
    G_numero = models.IntegerField()
    G_statut = models.CharField(max_length=50) # StatutGuichet

    def activer(self):
        pass
        
    def desactiver(self):
        pass

    def __str__(self):
        return f"Guichet {self.G_numero}"

class T_AffectationGuichet(models.Model):
    AG_id = models.CharField(primary_key=True, default=uuid.uuid4, max_length=50, editable=False)
    guichet = models.ForeignKey(T_Guichet, on_delete=models.CASCADE)
    file_attente = models.ForeignKey(T_File, on_delete=models.CASCADE)
    
    # Référence externe : T_Utilisateur (qui se trouve dans auth_service)
    U_id_agent = models.CharField(max_length=50)
    
    AG_dateDebut = models.DateTimeField(auto_now_add=True)
    AG_dateFin = models.DateTimeField(null=True, blank=True)
    AG_actif = models.BooleanField(default=True)

    def validerAffectation(self):
        pass