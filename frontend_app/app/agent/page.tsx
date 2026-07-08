"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Ticket {
  T_id: string;
  T_numero: string;
  T_statut: "EnAttente" | "EnCours" | "Absent" | "Cloture";
  T_dateEmission: string;
}

export default function ConsoleAgent() {
  // Informations de session de l'agent (Simulées d'après le diagramme de classes de SMGIFA.pdf)
  const [guichet, setGuichet] = useState({ id: "G1", numero: 3, statut: "Actif" });
  const [ticketActuel, setTicketActuel] = useState<Ticket | null>(null);
  const [historiqueSession, setHistoriqueSession] = useState<string[]>([]);
  
  // Gestion du chronomètre pour la règle métier des 3 minutes (No-Show)
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerActif, setTimerActif] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActif) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActif]);

  // Formater les secondes en MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // 1. Appeler le ticket suivant (POST /api/v1/quichets/appel-suivant/)
  const handleAppelerSuivant = async () => {
    try {
      const response = await fetch("/api/v1/quichets/appel-suivant/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer MOCK_JWT_TOKEN" // L'authentification est requise par SMGIFA.pdf
        }
      });
      if (response.ok) {
        const ticket = await response.json();
        activerNouveauTicket(ticket);
      } else {
        throw new Error();
      }
    } catch (error) {
      // Simulation locale FIFO si l'API est absente
      const randomNum = Math.floor(Math.random() * 900) + 100;
      const ticketSimule: Ticket = {
        T_id: Math.random().toString(),
        T_numero: `A-${randomNum}`,
        T_statut: "EnCours",
        T_dateEmission: new Date().toISOString()
      };
      activerNouveauTicket(ticketSimule);
    }
  };

  const activerNouveauTicket = (ticket: Ticket) => {
    setTicketActuel(ticket);
    setSecondsElapsed(0);
    setTimerActif(true);
  };

  // 2. Déclarer le client absent (Règle métier No-Show de SMGIFA.pdf)
  const handleMarquerAbsent = () => {
    if (!ticketActuel) return;
    setTimerActif(false);
    setTicketActuel({ ...ticketActuel, T_statut: "Absent" });
    setHistoriqueSession([`${ticketActuel.T_numero} (Absent)`, ...historiqueSession]);
  };

  // 3. Clôturer le rendez-vous
  const handleCloturerTicket = () => {
    if (!ticketActuel) return;
    setTimerActif(false);
    setHistoriqueSession([`${ticketActuel.T_numero} (Clôturé - ${formatTime(secondsElapsed)})`, ...historiqueSession]);
    setTicketActuel(null);
  };

  // 4. Transférer le ticket vers un autre service
  const handleTransfererTicket = (serviceDestination: string) => {
    if (!ticketActuel) return;
    setTimerActif(false);
    alert(`Ticket ${ticketActuel.T_numero} transféré avec succès vers le service : ${serviceDestination}`);
    setHistoriqueSession([`${ticketActuel.T_numero} (Transféré vers ${serviceDestination})`, ...historiqueSession]);
    setTicketActuel(null);
  };

  return (
    <main className="flex min-h-screen flex-col bg-gray-50 p-6">
      {/* En-tête / Barre supérieure */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border mb-6 gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-gray-800 text-sm border px-3 py-1 rounded">
            ← Menu
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Console Agent — WaitZeroBanque</h1>
        </div>
        <div className="flex gap-4 text-sm">
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-200">
            Guichet N°{guichet.numero}
          </span>
          <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium border border-green-200">
            Statut : {guichet.statut}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panneau Principal : Gestion du ticket courant */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border p-6 flex flex-col justify-between min-h-[450px]">
          {ticketActuel ? (
            <div>
              <div className="flex justify-between items-start border-b pb-4 mb-6">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-gray-400">Client en cours</span>
                  <div className="text-6xl font-black text-blue-900 mt-1">{ticketActuel.T_numero}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase font-bold tracking-wider text-gray-400">Temps écoulé</span>
                  <div className={`text-2xl font-mono font-bold mt-1 ${secondsElapsed >= 180 ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>
                    {formatTime(secondsElapsed)}
                  </div>
                  {secondsElapsed >= 180 && ticketActuel.T_statut === "EnCours" && (
                    <span className="text-xs text-red-500 font-medium">Seuil d&apos;absence atteint (3 min)</span>
                  )}
                </div>
              </div>

              {/* État actuel du ticket */}
              <div className="mb-8">
                <p className="text-sm text-gray-600">
                  Statut du ticket : <strong className="text-blue-700">{ticketActuel.T_statut}</strong>
                </p>
              </div>

              {/* Actions Métier */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <button
                  onClick={handleCloturerTicket}
                  disabled={ticketActuel.T_statut === "Absent"}
                  className="bg-green-600 text-white font-semibold p-3 rounded-xl shadow hover:bg-green-700 disabled:opacity-50 transition"
                >
                  Clôturer
                </button>
                <button
                  onClick={handleMarquerAbsent}
                  disabled={ticketActuel.T_statut === "Absent"}
                  className="bg-amber-500 text-white font-semibold p-3 rounded-xl shadow hover:bg-amber-600 disabled:opacity-50 transition"
                >
                  Client Absent
                </button>
                <button
                  onClick={() => handleTransfererTicket("Conseil Crédit")}
                  disabled={ticketActuel.T_statut === "Absent"}
                  className="bg-indigo-600 text-white font-semibold p-3 rounded-xl shadow hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                  Transférer
                </button>
                <button
                  onClick={handleAppelerSuivant}
                  className="bg-blue-100 text-blue-700 border border-blue-300 font-semibold p-3 rounded-xl hover:bg-blue-200 transition"
                >
                  Rappeler
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center my-auto text-center p-6">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-4">🔔</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Aucun client appelé</h2>
              <p className="text-gray-500 max-w-sm mb-6">Prêt à recevoir du public. Cliquez ci-dessous pour faire avancer la file d&apos;attente.</p>
              <button
                onClick={handleAppelerSuivant}
                className="bg-blue-600 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition"
              >
                Appeler le client suivant
              </button>
            </div>
          )}
        </div>

        {/* Panneau Latéral : Historique & Infos Guichet */}
        <div className="bg-white rounded-2xl shadow-md border p-6 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-4">Historique de la session</h3>
          {historiqueSession.length === 0 ? (
            <p className="text-sm text-gray-400 italic my-auto text-center">Aucun ticket traité depuis l&apos;ouverture.</p>
          ) : (
            <ul className="space-y-3 overflow-y-auto max-h-[350px] pr-2">
              {historiqueSession.map((entry, index) => (
                <li key={index} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="font-mono font-medium text-gray-700">{entry}</span>
                  <span className="text-xs text-gray-400">Récents</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}