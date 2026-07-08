"use client";

import { useState } from "react";
import Link from "next/link";

export default function ChefAgenceDashboard() {
  // Navigation
  const [activeTab, setActiveTab] = useState<"files" | "config" | "stats">("files");

  // Données dynamiques (Guichets et Services)
  const [guichets, setGuichets] = useState<string[]>(["Guichet 1", "Guichet 2", "Guichet 3"]);
  const [services, setServices] = useState<string[]>(["Retrait / Dépôt", "Ouverture de compte", "Conseiller"]);

  // États pour les formulaires d'ajout
  const [nouveauGuichet, setNouveauGuichet] = useState("");
  const [nouveauService, setNouveauService] = useState("");

  // Fonctions d'ajout
  const ajouterGuichet = () => {
    if (nouveauGuichet.trim() !== "" && !guichets.includes(nouveauGuichet)) {
      setGuichets([...guichets, nouveauGuichet]);
      setNouveauGuichet("");
    }
  };

  const ajouterService = () => {
    if (nouveauService.trim() !== "" && !services.includes(nouveauService)) {
      setServices([...services, nouveauService]);
      setNouveauService("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-blue-900 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Espace Chef d&apos;Agence - Agence Centrale</h1>
        <Link href="/login" className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-medium transition">
          Déconnexion
        </Link>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r shadow-sm p-4 hidden md:block">
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab("files")}
              className={`w-full text-left p-3 rounded-lg font-medium transition ${activeTab === "files" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}
            >
              Gestion des Files
            </button>
            <button 
              onClick={() => setActiveTab("config")}
              className={`w-full text-left p-3 rounded-lg font-medium transition ${activeTab === "config" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}
            >
              Configuration Agence
            </button>
            <button 
              onClick={() => setActiveTab("stats")}
              className={`w-full text-left p-3 rounded-lg font-medium transition ${activeTab === "stats" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}
            >
              Statistiques Locales
            </button>
          </nav>
        </aside>

        {/* Contenu Principal */}
        <main className="flex-1 p-8">
          {/* ONGLET 1 : GESTION OPÉRATIONNELLE */}
          {activeTab === "files" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Gestion Opérationnelle</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ouvrir une file */}
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                  <h3 className="text-lg font-semibold text-green-700 mb-4">Ouvrir une File</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="guichet-selection" className="block text-sm text-gray-600 mb-1">Sélection Guichet</label>
                      <select id="guichet-selection" name="guichet" className="w-full p-2 border rounded bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none">
                        {guichets.map((g, index) => (
                          <option key={index} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="service-selection" className="block text-sm text-gray-600 mb-1">Choisir Service</label>
                      <select id="service-selection" name="service" className="w-full p-2 border rounded bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none">
                        {services.map((s, index) => (
                          <option key={index} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                      Affecter & Ouvrir
                    </button>
                  </div>
                </div>

                {/* Files Actives */}
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                  <h3 className="text-lg font-semibold text-red-700 mb-4">Files Actives (Fermeture)</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center bg-gray-50 p-3 rounded border">
                      <div>
                        <span className="font-bold text-gray-700">{guichets[0]}</span>
                        <p className="text-sm text-gray-500">Service: {services[0]}</p>
                      </div>
                      <button className="text-red-500 hover:text-red-700 font-medium text-sm">Fermer File</button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ONGLET 2 : CONFIGURATION (NOUVEAU) */}
          {activeTab === "config" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Paramétrage de l&apos;Agence</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Configuration des Guichets */}
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">Gestion des Guichets</h3>
                  <div className="flex gap-2 mb-4">
                    <input 
                      type="text" 
                      value={nouveauGuichet}
                      onChange={(e) => setNouveauGuichet(e.target.value)}
                      placeholder="Ex: Guichet 4, Guichet VIP..."
                      className="flex-1 p-2 border rounded outline-none focus:border-blue-500"
                    />
                    <button 
                      onClick={ajouterGuichet}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Ajouter
                    </button>
                  </div>
                  <ul className="space-y-2 border-t pt-4">
                    {guichets.map((g, index) => (
                      <li key={index} className="bg-gray-50 p-2 rounded text-gray-700 border flex justify-between">
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Configuration des Services */}
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">Gestion des Services</h3>
                  <div className="flex gap-2 mb-4">
                    <input 
                      type="text" 
                      value={nouveauService}
                      onChange={(e) => setNouveauService(e.target.value)}
                      placeholder="Ex: Western Union, Réclamation..."
                      className="flex-1 p-2 border rounded outline-none focus:border-blue-500"
                    />
                    <button 
                      onClick={ajouterService}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Ajouter
                    </button>
                  </div>
                  <ul className="space-y-2 border-t pt-4">
                    {services.map((s, index) => (
                      <li key={index} className="bg-gray-50 p-2 rounded text-gray-700 border flex justify-between">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ONGLET 3 : STATISTIQUES */}
          {activeTab === "stats" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Statistiques Locales du Jour</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border shadow-sm text-center">
                  <div className="text-4xl font-black text-blue-600 mb-2">142</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide">Tickets Émis</div>
                </div>
                <div className="bg-white p-6 rounded-xl border shadow-sm text-center">
                  <div className="text-4xl font-black text-green-600 mb-2">08:45</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide">Temps d&apos;attente moyen (min)</div>
                </div>
                <div className="bg-white p-6 rounded-xl border shadow-sm text-center">
                  <div className="text-4xl font-black text-amber-500 mb-2">3</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide">Abandons (No-Show)</div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}