import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-12">
          WaitZeroBanque - Mode Développement
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Module 1 : Borne Client */}
          <Link href="/borne" className="group rounded-lg border border-transparent px-5 py-8 transition-colors hover:border-blue-300 hover:bg-blue-50 bg-white shadow-md">
            <h2 className="mb-3 text-2xl font-semibold text-blue-700">
              Borne d&apos;Accueil <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">-&gt;</span>
            </h2>
            <p className="m-0 text-sm text-gray-600">
              Interface tactile pour la sélection du motif et l&apos;émission de ticket.
            </p>
          </Link>

          {/* Module 2 : Console Agent */}
          <Link href="/agent" className="group rounded-lg border border-transparent px-5 py-8 transition-colors hover:border-green-300 hover:bg-green-50 bg-white shadow-md">
            <h2 className="mb-3 text-2xl font-semibold text-green-700">
              Console Agent <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">-&gt;</span>
            </h2>
            <p className="m-0 text-sm text-gray-600">
              Interface de guichet pour appeler, transférer et clôturer les tickets.
            </p>
          </Link>

          {/* Module 3 : Écran d'affichage */}
          <Link href="/ecran" className="group rounded-lg border border-transparent px-5 py-8 transition-colors hover:border-purple-300 hover:bg-purple-50 bg-white shadow-md">
            <h2 className="mb-3 text-2xl font-semibold text-purple-700">
              Affichage Salle <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">-&gt;</span>
            </h2>
            <p className="m-0 text-sm text-gray-600">
              Écran dynamique avec notifications visuelles et alertes sonores.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}