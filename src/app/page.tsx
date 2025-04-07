'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un temps de chargement pour montrer les options
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6">Bienvenue</h1>
        
        <div className="space-y-4">
          <Link 
            href="/login" 
            className="w-full block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Se connecter
          </Link>
          
          <Link 
            href="/list" 
            className="w-full block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Voir la liste publique
          </Link>
        </div>
      </div>
    </div>
  );
}
