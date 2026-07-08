"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface AppelClient {
  id: string;
  ticket: string;
  guichet: number;
  timestamp: Date;
}

export default function EcranAffichage() {
  const [appelCourant, setAppelCourant] = useState<AppelClient | null>(null);
  const [historique, setHistorique] = useState<AppelClient[]>([]);
  const [flashActive, setFlashActive] = useState(false);
  const [ecranDemarre, setEcranDemarre] = useState(false); // Nécessaire pour débloquer l'audio du navigateur

  // Fonction pour déclencher l'alerte sonore (Synthèse vocale) 
  const jouerAlerteSonore = (ticket: string, guichet: number) => {
    if ("speechSynthesis" in window) {
      const message = new SpeechSynthesisUtterance(`Le ticket ${ticket} est attendu au guichet ${guichet}.`);
      message.lang = "fr-FR";
      message.rate = 0.9; // Vitesse légèrement ralentie pour plus de clarté
      window.speechSynthesis.speak(message);
    }
  };

  // Simuler la réception d'un événement WebSocket [cite: 163]
  const simulerNouvelAppel = () => {
    const nouveauTicket = `A-${Math.floor(Math.random() * 900) + 100}`;
    const nouveauGuichet = Math.floor(Math.random() * 5) + 1;
    
    const nouvelAppel = {
      id: Math.random().toString(),
      ticket: nouveauTicket,
      guichet: nouveauGuichet,
      timestamp: new Date(),
    };

    // Mettre l'appel actuel dans l'historique (s'il y en a un)
    if (appelCourant) {
      setHistorique((prev) => [appelCourant, ...prev].slice(0, 4)); // Garde les 4 derniers
    }

    setAppelCourant(nouvelAppel);
    setFlashActive(true);
    jouerAlerteSonore(nouveauTicket, nouveauGuichet);

    // Arrêter le flash visuel après 3 secondes 
    setTimeout(() => {
      setFlashActive(false);
    }, 3000);
  };

  // Les navigateurs bloquent le son s'il n'y a pas eu d'interaction de l'utilisateur
  if (!ecranDemarre) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Écran d&apos;Affichage WaitZeroBanque</h1>
          <p className="mb-8 text-gray-400">Une interaction est requise pour activer les alertes sonores.</p>
          <button 
            onClick={() => setEcranDemarre(true)}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl text-2xl font-bold transition"
          >
            Démarrer l&apos;écran TV
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className={`flex min-h-screen flex-col transition-colors duration-500 ${flashActive ? 'bg-green-600' : 'bg-gray-50'}`}>
      
      {/* En-tête discret (à masquer en production TV) */}
      <div className="absolute top-4 left-4 z-50 flex gap-2">
        <Link href="/" className="bg-gray-800 text-white text-xs px-3 py-2 rounded shadow opacity-50 hover:opacity-100 transition">
          ← Quitter
        </Link>
        <button 
          onClick={simulerNouvelAppel}
          className="bg-purple-600 text-white text-xs px-3 py-2 rounded shadow opacity-50 hover:opacity-100 transition"
        >
          [Dev] Simuler Appel WebSocket
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Zone Principale : Appel en cours */}
        <div className="flex-1 flex flex-col items-center justify-center p-10">
          {appelCourant ? (
            <div className={`text-center bg-white rounded-3xl p-16 shadow-2xl w-full max-w-4xl transform transition-transform duration-300 ${flashActive ? 'scale-105 border-8 border-green-400' : 'border border-gray-200'}`}>
              <h2 className="text-5xl font-bold text-gray-500 uppercase tracking-widest mb-6">
                Ticket Appelé
              </h2>
              <div className="text-[12rem] font-black text-blue-900 leading-none mb-8">
                {appelCourant.ticket}
              </div>
              <div className="flex items-center justify-center gap-6">
                <span className="text-6xl text-gray-600">Allez au</span>
                <span className="text-7xl font-extrabold text-white bg-blue-700 px-8 py-4 rounded-2xl">
                  Guichet {appelCourant.guichet}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center opacity-50">
              <h2 className="text-5xl font-bold text-gray-400">En attente d&apos;appels...</h2>
            </div>
          )}
        </div>

        {/* Barre Latérale : Historique des derniers appels */}
        <div className="w-1/3 bg-gray-900 text-white p-8 flex flex-col shadow-inner">
          <h3 className="text-3xl font-bold text-gray-400 mb-8 border-b border-gray-700 pb-4 uppercase tracking-wider">
            Appels Précédents
          </h3>
          
          <div className="flex flex-col gap-6">
            {historique.length === 0 ? (
              <p className="text-xl text-gray-600 italic">Aucun historique</p>
            ) : (
              historique.map((appel, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-800 p-6 rounded-xl border-l-8 border-gray-600">
                  <div className="text-5xl font-bold">{appel.ticket}</div>
                  <div className="text-2xl text-gray-300 flex flex-col items-end">
                    <span>Guichet</span>
                    <span className="text-4xl font-bold text-white">{appel.guichet}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-auto text-center pt-8">
            <p className="text-blue-400 text-xl font-medium">WaitZeroBanque</p>
          </div>
        </div>
      </div>
    </main>
  );
}