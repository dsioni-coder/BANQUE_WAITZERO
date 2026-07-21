import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  // On récupère le jeton JWT décrypté depuis les cookies
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const isAuth = !!token;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login');

  // RÈGLE 1 : Si l'utilisateur est DÉJÀ connecté et essaie d'aller sur /login
  if (isAuthPage) {
    if (isAuth) {
      // On le force à aller sur son tableau de bord
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    // S'il n'est pas connecté, on le laisse aller sur la page de login
    return null;
  }

  // RÈGLE 2 : Si l'utilisateur n'est PAS connecté et essaie d'accéder à une autre page (ex: /dashboard)
  if (!isAuth) {
    // On le renvoie à l'accueil/login
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Ici, on définit sur quelles URLs ce middleware doit s'activer
export const config = {
  matcher: [
    '/dashboard/:path*', // Protège tout le tableau de bord
    '/login'             // Surveille la page de login pour bloquer ceux déjà connectés
  ]
};