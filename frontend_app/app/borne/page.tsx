"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Définition des types basés sur votre modèle de données
interface ServiceMetier {
  SM_id: string;
  SM_nom: string;
  SM_description: string;
  FI_id: string; // L'ID de la file associée pour le POST
}

export default function BorneAccueil() {
  const [services, setServices] = useState<ServiceMetier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ticketGenere, setTicketGenere] = useState<string | null>(null);

  useEffect(() => {
    // Tentative de récupération des services depuis l'API Django locale
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/v1/services-metier/");
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        } else {
          throw new Error("API non disponible");
        }
      } catch (error) {
        console.warn("Utilisation des services par défaut car l'API est injoignable.");
        // Données par défaut issues du rapport technique (retrait, dépôt, ouverture, etc.)
        setServices([
          { SM_id: "1", SM_nom: "Retrait / Dépôt", SM_description: "Opérations courantes de caisse", FI_id: "F1" },
          { SM_id: "2", SM_nom: "Ouverture de compte", SM_description: "Devenir client de la banque", FI_id: "F2" },
          { SM_id: "3", SM_nom: "Conseiller / Crédit", SM_description: "Rendez-vous avec un conseiller", FI_id: "F3" },
          { SM_id: "4", SM_nom: "Transfert", SM_description: "Envoi ou réception d'argent", FI_id: "F4" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleDemandeTicket = async (fileId: string, nomService: string) => {
    // Logique pour appeler le POST /api/v1/tickets/
    try {
      const response = await fetch("/api/v1/tickets/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ FI_id: fileId }),
      });

      if (response.ok) {
        const data = await response.json();
        afficherTicket(data.T_numero); // On suppose que l'API renvoie le numéro
      } else {
        throw new Error("Erreur de création");
      }
    } catch (error) {
      // Simulation locale si l'API est absente
      const numeroSimule = "A" + Math.floor(Math.random() * 1000);
      afficherTicket(numeroSimule);
    }
  };

  const afficherTicket = (numero: string) => {
    setTicketGenere(numero);
    // Masquer le ticket après 5 secondes pour le client suivant
    setTimeout(() => {
      setTicketGenere(null);
    }, 5000);
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-2xl font-bold">Chargement de la borne...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-10 bg-gray-100 touch-none select-none">
      
      {/* Bouton de retour discret pour le mode développement */}
      <div className="w-full flex justify-start mb-4">
        <Link href="/" className="text-gray-400 hover:text-gray-800 text-sm border px-3 py-1 rounded">
          ← Retour Menu
        </Link>
      </div>

      <div className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-5xl font-extrabold text-blue-900 mb-4 tracking-tight">
          Bienvenue chez WaitZeroBanque
        </h1>
        <p className="text-2xl text-gray-600">
          Veuillez toucher l'écran pour sélectionner votre motif de visite
        </p>
      </div>

      {/* Affichage du ticket généré (Simulation de l'impression) */}
      {ticketGenere ? (
        <div className="bg-white border-4 border-green-500 rounded-2xl p-12 text-center shadow-2xl animate-pulse my-auto">
          <h2 className="text-3xl text-gray-700 mb-4">Votre numéro est le</h2>
          <div className="text-8xl font-black text-green-600 mb-6">{ticketGenere}</div>
          <p className="text-xl text-gray-500">Impression du ticket en cours...</p>
          <p className="text-md text-gray-400 mt-2">Veuillez patienter en salle d'attente</p>
        </div>
      ) : (
        /* Grille des services (Interface tactile) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mt-8">
          {services.map((service) => (
            <button
              key={service.SM_id}
              onClick={() => handleDemandeTicket(service.FI_id, service.SM_nom)}
              className="group flex flex-col items-center justify-center bg-white p-10 rounded-2xl shadow-lg border-2 border-transparent hover:border-blue-500 active:bg-blue-50 transition-all duration-200"
            >
              <span className="text-3xl font-bold text-gray-800 mb-2 group-active:scale-95">
                {service.SM_nom}
              </span>
              <span className="text-lg text-gray-500">
                {service.SM_description}
              </span>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}