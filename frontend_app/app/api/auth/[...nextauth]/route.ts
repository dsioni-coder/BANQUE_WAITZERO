// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { jwtDecode } from "jwt-decode" 

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Django Login",
      credentials: {
        U_login: { label: "Identifiant", type: "text" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.U_login || !credentials?.password) return null

        try {
          // 👉 On appelle le service auth de Django via le réseau interne Docker !
          const res = await fetch("http://127.0.0.1:8001/api/auth/login/", {
            method: "POST",
            body: JSON.stringify({
              U_login: credentials.U_login,
              password: credentials.password,
            }),
            headers: { "Content-Type": "application/json" },
          })

          const tokens = await res.json()

          if (res.ok && tokens.access) {
            // On décode le Access Token pour lire le payload personnalisé
            const decoded: any = jwtDecode(tokens.access)
            console.log("🔍 CONTENU DU TOKEN DEPUIS DJANGO :", decoded)

            // On retourne l'objet User complet que NextAuth va stocker dans le JWT de session
            return {
              id: decoded.user_id,
              nom: decoded.nom,
              prenom: decoded.prenom,
              login: decoded.login,
              groupes: decoded.groupes || [],
              accessToken: tokens.access,
              refreshToken: tokens.refresh,
            }
          }
          return null
        } catch (error) {
          console.error("Erreur lors de la connexion au auth_service:", error)
          return null
        }
      }
    })
  ],
  callbacks: {
    // 1. Persister les données du backend Django dans le JWT géré par NextAuth
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.nom = user.nom
        token.prenom = user.prenom
        token.login = user.login
        token.groupes = user.groupes
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }
      return token
    },
    // 2. Rendre ces données accessibles dans la session côté React (Client & Server)
    async session({ session, token }) {
      session.user.id = token.id
      session.user.nom = token.nom
      session.user.prenom = token.prenom
      session.user.login = token.login
      session.user.groupes = token.groupes
      session.accessToken = token.accessToken
      session.error = token.error
      return session
    }
  },
  pages: {
    signIn: "/login", // Votre page de login personnalisée
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }