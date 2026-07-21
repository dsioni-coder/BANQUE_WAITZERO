"use client";

import { useSession, signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center">Chargement des données...</div>;
  }

  // Sécurité supplémentaire : si pas de session, on ne rend rien (le middleware s'en chargera)
  if (!session) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Barre de navigation supérieure */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Agence Smart Queue</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 text-right">
            <p className="font-semibold text-gray-900">
              {session.user.prenom} {session.user.nom}
            </p>
            <p className="text-xs">
              Rôle : {session.user.groupes?.join(", ") || "Employé standard"}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 transition"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Contenu principal du tableau de bord */}
      <main className="flex-1 p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Carte 1 : Informations */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Mon Profil</h2>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><strong>Login :</strong> {session.user.login}</li>
              <li><strong>ID Unique :</strong> {session.user.id.slice(0, 8)}...</li>
            </ul>
          </div>

          {/* Carte 2 : Files d'attente (Espace réservé pour la suite) */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Gestion des Files</h2>
            <p className="text-sm text-gray-500 italic">
              Les compteurs de tickets et l'appel des clients s'afficheront ici une fois le service Kafka connecté.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}