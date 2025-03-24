import React, {
   createContext,
   useContext,
   useState,
   useEffect,
   FC,
} from 'react';
import {
   onAuthStateChanged,
   signInWithEmailAndPassword,
   createUserWithEmailAndPassword,
   signOut,
   signInWithPopup,
   User,
   UserCredential,
} from 'firebase/auth';
import { getDoc, doc, setDoc } from 'firebase/firestore';

import { db, auth, googleProvider } from '../firebase/firebaseConfig.ts';

import {
   UserProfile,
   AuthContextType,
   AuthProviderProps,
} from './interfaces.ts';

// Creazione del context di autenticazione.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Gestisce lo stato di autenticazione e il profilo dell'utente, tramite Firebase Auth e Firestore.
 * Context contiene: user, profile, login, logout, signUp, signInWithGoogle.
 */
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
   const [user, setUser] = useState<User | null>(null);
   const [profile, setProfile] = useState<UserProfile | null>(null);

   useEffect(() => {
      // Quando lo stato di autenticazione cambia, aggiorna lo stato dell'utente e del profilo.
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
         setUser(currentUser);

         if (currentUser)
            try {
               // Riferimento al documento del profilo utente in Firestore.
               const docRef = doc(db, 'users', currentUser.uid);
               const docSnap = await getDoc(docRef);

               // Se il documento esiste, aggiorna lo stato del profilo.
               if (docSnap.exists()) {
                  const data = docSnap.data() as UserProfile;
                  setProfile(data);
               } else {
                  setProfile(null);
               }
            } catch (error) {
               console.error('Error fetch user profile:', error);
               setProfile(null);
            }
         else {
            // Se l'utente si disconnette, azzera il profilo.
            setProfile(null);
         }
      });

      // Cleanup all'unmount del componente.
      return unsubscribe;
   }, []);

   /** Registrazione con email e password */
   const signUp = async (
      email: string,
      password: string
   ): Promise<UserCredential> => {
      return await createUserWithEmailAndPassword(auth, email, password);
   };

   /** Login con email e password */
   const login = async (email: string, password: string): Promise<void> => {
      await signInWithEmailAndPassword(auth, email, password);
   };

   /** Login con Google */
   const signInWithGoogle = async (): Promise<void> => {
      try {
         // Prompt per selezionare l'account Google, poi autenticazione.
         googleProvider.setCustomParameters({ prompt: 'select_account' });
         const result = await signInWithPopup(auth, googleProvider);
         const googleUser = result.user;

         // Se l'utente non esiste in Firestore, lo creiamo
         const userRef = doc(db, 'users', googleUser.uid);
         const snap = await getDoc(userRef);

         if (!snap.exists())
            await setDoc(userRef, {
               username: googleUser.displayName || 'Utente Google',
               email: googleUser.email,
               createdAt: new Date(),
            });
      } catch (error) {
         console.error('Errore autenticazione con Google:', error);
      }
   };

   const logout = async (): Promise<void> => {
      await signOut(auth);
   };

   // Context passato ai componenti figli.
   return (
      <AuthContext.Provider
         value={{
            user,
            profile,
            signUp,
            login,
            signInWithGoogle,
            logout,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
};

/**
 * Custom hook per utilizzare il context di autenticazione.
 */
export function useAuth(): AuthContextType {
   const context = useContext(AuthContext);

   if (!context) throw new Error('Errore in useAuth');

   return context;
}
