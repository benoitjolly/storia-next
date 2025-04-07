'use client';

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import authService from '@/services/auth.service';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    // Nettoyage
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await authService.signInWithGoogle();
      router.push('/home');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
}

export default useAuth; 