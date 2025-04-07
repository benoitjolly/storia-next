import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User,
  UserCredential
} from 'firebase/auth';
import { auth } from '@/config/firebase';

export const authService = {
  // Se connecter avec Google
  signInWithGoogle: async (): Promise<UserCredential> => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  },
  
  // Se déconnecter
  signOut: async (): Promise<void> => {
    return signOut(auth);
  },
  
  // Observer les changements d'état d'authentification
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },
  
  // Récupérer l'utilisateur actuel
  getCurrentUser: (): User | null => {
    return auth.currentUser;
  }
};

export default authService; 