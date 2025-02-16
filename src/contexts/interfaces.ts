import { ReactNode } from 'react';
import { User, UserCredential } from 'firebase/auth';

export interface UserProfile {
   username: string;
}

export interface AuthContextType {
   user: User | null;
   profile: UserProfile | null;
   signUp: (email: string, password: string) => Promise<UserCredential>;
   login: (email: string, password: string) => Promise<void>;
   signInWithGoogle: () => Promise<void>;
   logout: () => Promise<void>;
}

export interface AuthProviderProps {
   children: ReactNode;
}
