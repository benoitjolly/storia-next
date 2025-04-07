'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/store/AuthContext';
import Header from '@/components/layout/Header';

export default function ListPage() {
  const { isAuthenticated, user } = useAuthContext();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Liste Publique</h1>
            <div className="flex gap-2">
              {isAuthenticated ? (
                <Link 
                  href="/home" 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Accueil
                </Link>
              ) : (
                <Link 
                  href="/login" 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Se connecter
                </Link>
              )}
            </div>
          </div>

          {isAuthenticated && (
            <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
              <p className="text-green-800">
                Vous êtes connecté en tant que {user?.displayName || "Utilisateur"}
              </p>
            </div>
          )}

          <div className="mb-8">
            <p className="text-gray-700 mb-4">
              Cette page est accessible à tous les utilisateurs, qu{"'"}ils soient connectés ou non.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-4">Liste des éléments publics</h2>
            <ul className="space-y-2">
              {[1, 2, 3, 4, 5].map((item) => (
                <li key={item} className="border-b pb-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Élément public #{item}</span>
                    <span className="text-gray-500 text-sm">ID: {item}</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Description de l{"'"}élément public {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
} 