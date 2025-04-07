'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/store/AuthContext';
import NotificationCenter from '@/components/ui/NotificationCenter';

export default function Header() {
  const { isAuthenticated, signOut, user } = useAuthContext();

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                Storia
              </Link>
            </div>
            <nav className="ml-6 flex items-center space-x-4">
              <Link href="/list" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Liste
              </Link>
              {isAuthenticated && (
                <>
                  <Link href="/home" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    Accueil
                  </Link>
                  <Link href="/generepodcast" className="text-indigo-600 hover:text-indigo-900 px-3 py-2 rounded-md text-sm font-medium">
                    Générer un podcast
                  </Link>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated && <NotificationCenter />}
            
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-500">
                  {user?.displayName || 'Utilisateur'}
                </span>
                <button
                  onClick={signOut}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-500 hover:bg-red-600"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 