import { ReactNode } from 'react';
import { User, UserCredential } from 'firebase/auth';

export interface UserProfile {
   username: string;
}

export interface AuthContextType {
   user: User | null;
   profile: UserProfile | null;
   login: (email: string, password: string) => Promise<void>;
   logout: () => Promise<void>;
   signUp: (email: string, password: string) => Promise<UserCredential>;
}

export interface AuthProviderProps {
   children: ReactNode;
}
