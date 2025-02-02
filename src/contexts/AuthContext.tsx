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
   User,
   UserCredential,
} from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';

import { db, auth } from '../firebase/firebaseConfig.ts';

import {
   UserProfile,
   AuthContextType,
   AuthProviderProps,
} from './interfaces.ts';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Gestisce lo stato di autenticazione e il profilo dell'utente, tramite Firebase Auth e Firestore.
 * Context contiene: user, profile, login, logout, signUp.
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
               console.error('Errore fetch user profile:', error);
               setProfile(null);
            }
         else {
            // Se l'utente si disconnette, azzera il profilo.
            setProfile(null);
         }
      });

      // Cleanup quando unmount del componente.
      return unsubscribe;
   }, []);

   const login = async (email: string, password: string): Promise<void> => {
      await signInWithEmailAndPassword(auth, email, password);
   };

   const logout = async (): Promise<void> => {
      await signOut(auth);
   };

   const signUp = async (
      email: string,
      password: string
   ): Promise<UserCredential> => {
      return await createUserWithEmailAndPassword(auth, email, password);
   };

   // Context passato a tutti i componenti figli.
   return (
      <AuthContext.Provider value={{ user, profile, login, logout, signUp }}>
         {children}
      </AuthContext.Provider>
   );
};

/**
 * Custom hook per utilizzare il context di autenticazione.
 */
export function useAuth(): AuthContextType {
   const context = useContext(AuthContext);

   if (!context) throw new Error('useAuth deve essere usato con AuthProvider.');

   return context;
}
