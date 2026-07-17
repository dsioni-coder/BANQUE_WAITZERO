"use client";

import { useState } from "react";
import { signIn, useSession, signOut } from "next-auth/react";

export default function LoginPage() {
  // Récupération de la session en cours
  const { data: session, status } = useSession();
  
  // États du formulaire
  const [uLogin, setULogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 1. Si NextAuth est en train de vérifier le cookie
  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center">Chargement...</div>;
  }

  // 2. Si Awal (ou un autre utilisateur) est DÉJÀ connecté
  if (status === "authenticated") {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
        <div className="rounded-lg bg-white p-8 shadow-lg text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            Connexion Réussie !
          </h1>
          <p className="mb-2">
            Bienvenue, <strong>{session.user.prenom} {session.user.nom}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Identifiant : {session.user.login} <br />
            ID Base de données : {session.user.id}
          </p>
          
          <button
            onClick={() => signOut()}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  // 3. Si l'utilisateur n'est PAS connecté, on affiche le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Appel à NextAuth (qui appellera notre backend Django en interne)
    const res = await signIn("credentials", {
      U_login: uLogin,
      password: password,
      redirect: false, // On désactive la redirection automatique pour gérer les erreurs ici
    });

    if (res?.error) {
      setError("Identifiant ou mot de passe incorrect.");
      setIsLoading(false);
    }
    // Si res.ok est vrai, NextAuth met à jour la session, 
    // et le composant se re-rendra automatiquement dans l'état "authenticated"
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Portail Employé
        </h2>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Identifiant
            </label>
            <input
              type="text"
              required
              value={uLogin}
              onChange={(e) => setULogin(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              placeholder="ex: Awal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none disabled:bg-blue-400"
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}