import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/firebaseConfig.ts';
import {
   onAuthStateChanged,
   signInWithEmailAndPassword,
   createUserWithEmailAndPassword,
   signOut,
   User,
} from 'firebase/auth';

interface AuthContextType {
   user: User | null;
   login: (email: string, password: string) => Promise<void>;
   logout: () => Promise<void>;
   signUp: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
   children,
}) => {
   const [user, setUser] = useState<User | null>(null);

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
         setUser(currentUser);
      });
      return unsubscribe;
   }, []);

   const login = async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email, password);
   };

   const logout = async () => {
      await signOut(auth);
   };

   const signUp = async (email: string, password: string) => {
      await createUserWithEmailAndPassword(auth, email, password);
   };

   return (
      <AuthContext.Provider value={{ user, login, logout, signUp }}>
         {children}
      </AuthContext.Provider>
   );
};

export function useAuth() {
   const context = useContext(AuthContext);
   if (!context) throw new Error('useAuth must be used within an AuthProvider');

   return context;
}
