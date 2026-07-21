"use client";

import { useState } from "react";
import Link from "next/link";

export default function SuperAdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("users");

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Navbar Centrale */}
      <header className="bg-slate-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="bg-purple-600 p-1.5 rounded text-xs font-bold">CORE</span>
          <h1 className="text-xl font-bold">WaitZeroBanque - Administration Centrale</h1>
        </div>
        <Link href="/login" className="text-slate-300 hover:text-white text-sm underline">Déconnexion</Link>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Admin */}
        <aside className="w-64 bg-slate-800 text-slate-300 flex flex-col hidden md:flex">
          <nav className="flex-1 p-4 space-y-1">
            <button onClick={() => setActiveMenu("users")} className={`w-full text-left p-3 rounded transition ${activeMenu === "users" ? "bg-slate-700 text-white" : "hover:bg-slate-700"}`}>
              Gérer Utilisateurs
            </button>
            <button onClick={() => setActiveMenu("groups")} className={`w-full text-left p-3 rounded transition ${activeMenu === "groups" ? "bg-slate-700 text-white" : "hover:bg-slate-700"}`}>
              Groupes & Droits d&apos;Accès
            </button>
            <button onClick={() => setActiveMenu("stats")} className={`w-full text-left p-3 rounded transition ${activeMenu === "stats" ? "bg-slate-700 text-white" : "hover:bg-slate-700"}`}>
              Statistiques Globales
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeMenu === "users" && (
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Gestion des Utilisateurs</h2>
                <button className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700">+ Nouvel Utilisateur</button>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-sm border-b">
                    <th className="p-3">Nom</th>
                    <th className="p-3">Identifiant</th>
                    <th className="p-3">Groupe</th>
                    <th className="p-3">Agence</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b">
                    <td className="p-3 font-medium text-black">Olomgba Ricoeur</td>
                    <td className="p-3 text-black">oricoeur</td>
                    <td className="p-3"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs text-black">Agent</span></td>
                    <td className="p-3 text-black">Agence Centre-ville</td>
                    <td className="p-3 text-blue-600 cursor-pointer hover:underline text-black">Modifier</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium text-black">Aminata Bâ</td>
                    <td className="p-3 text-black">abâ</td>
                    <td className="p-3 text-black"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Chef Agence</span></td>
                    <td className="p-3 text-black">Agence Km5</td>
                    <td className="p-3 text-blue-600 cursor-pointer hover:underline text-black">Modifier</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeMenu === "groups" && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Configuration des Droits</h2>
              <p className="text-slate-500">Interface de mappage entre les Rôles (Super Admin, Chef d&apos;Agence, Agent) et les permissions système.</p>
              {/* Espace pour le formulaire de droits */}
            </div>
          )}

          {activeMenu === "stats" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800">Consolidation Réseau (Toutes agences)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded border-l-4 border-purple-500 shadow-sm">
                  <p className="text-slate-500 text-sm">Volume Tickets (National)</p>
                  <p className="text-2xl font-bold mt-1 text-purple-500">1,245</p>
                </div>
                <div className="bg-white p-5 rounded border-l-4 border-green-500 shadow-sm">
                  <p className="text-slate-500 text-sm">Temps Moyen (National)</p>
                  <p className="text-2xl font-bold mt-1 text-green-500">12m 30s</p>
                </div>
                <div className="bg-white p-5 rounded border-l-4 border-red-500 shadow-sm">
                  <p className="text-slate-500 text-sm">Agences Hors-Ligne</p>
                  <p className="text-2xl font-bold mt-1 text-red-600">0</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}