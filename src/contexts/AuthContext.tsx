import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/firebaseConfig.ts';
import {
   onAuthStateChanged,
   signInWithEmailAndPassword,
   createUserWithEmailAndPassword,
   signOut,
   User,
   UserCredential,
} from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';

import { db } from '../firebase/firebaseConfig.ts';

export interface UserProfile {
   username: string;
}

interface AuthContextType {
   user: User | null;
   profile: UserProfile | null;
   login: (email: string, password: string) => Promise<void>;
   logout: () => Promise<void>;
   signUp: (email: string, password: string) => Promise<UserCredential>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
   children,
}) => {
   const [user, setUser] = useState<User | null>(null);
   const [profile, setProfile] = useState<UserProfile | null>(null);

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
         setUser(currentUser);
         if (currentUser) {
            try {
               const docRef = doc(db, 'users', currentUser.uid);
               const docSnap = await getDoc(docRef);
               if (docSnap.exists()) {
                  const data = docSnap.data() as UserProfile;
                  setProfile(data);
               } else setProfile(null);
            } catch (error) {
               console.error('Errore nel recupero del profilo:', error);
               setProfile(null);
            }
         } else setProfile(null);
      });
      return unsubscribe;
   }, []);

   const login = async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email, password);
   };

   const logout = async () => {
      await signOut(auth);
   };

   const signUp = async (
      email: string,
      password: string
   ): Promise<UserCredential> => {
      const userCredential = await createUserWithEmailAndPassword(
         auth,
         email,
         password
      );
      return userCredential;
   };

   return (
      <AuthContext.Provider value={{ user, profile, login, logout, signUp }}>
         {children}
      </AuthContext.Provider>
   );
};

export function useAuth() {
   const context = useContext(AuthContext);
   if (!context) throw new Error('useAuth must be used within an AuthProvider');

   return context;
}
