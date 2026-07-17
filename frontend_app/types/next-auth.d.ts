// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string
    nom: string
    prenom: string
    login: string
    groupes: string[]
    accessToken: string
    refreshToken: string
  }

  interface Session {
    user: {
      id: string
      nom: string
      prenom: string
      login: string
      groupes: string[]
    } & DefaultSession["user"]
    accessToken: string
    error?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    nom: string
    prenom: string
    login: string
    groupes: string[]
    accessToken: string
    refreshToken: string
    accessTokenExpires: number
    error?: string
  }
}