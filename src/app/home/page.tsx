'use client';

import React from 'react';
import { useAuthContext } from '@/store/AuthContext';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Link from 'next/link';

export default function HomePage() {
  const { user, signOut } = useAuthContext();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Accueil</h1>
            <div className="flex gap-2">
              <Link 
                href="/list" 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Liste publique
              </Link>
              <button
                onClick={signOut}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Se déconnecter
              </button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
            <h2 className="text-lg font-semibold mb-2">Bienvenue {user?.displayName || "Utilisateur"} !</h2>
            <p className="text-gray-700">
              Cette page est protégée et n{"'"}est accessible que pour les utilisateurs connectés.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="border rounded-lg p-4 hover:shadow-md transition">
                <h3 className="font-medium mb-2">Élément {item}</h3>
                <p className="text-gray-600 text-sm">
                  Description de l{"'"}élément {item}. Ceci est un contenu d{"'"}exemple.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 