import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';

import { useAuth } from '../../../contexts/AuthContext.tsx';
import AuthForm from '../../AuthForm/index.tsx';
import { db } from '../../../firebase/firebaseConfig.ts';
import useFirebaseErrorMessage from '../../../hooks/useFirebaseErrorMessage.ts';

const Signup: React.FC = () => {
   const { signUp } = useAuth();
   const navigate = useNavigate(); // Hook di React Router
   const { getErrorMessage } = useFirebaseErrorMessage();

   const [username, setUsername] = useState<string>('');
   const [email, setEmail] = useState<string>('');
   const [password, setPassword] = useState<string>('');
   const [error, setError] = useState<string>('');
   const [isLoading, setIsLoading] = useState<boolean>(false);

   const handleSubmit = async (
      e: React.FormEvent<HTMLFormElement>
   ): Promise<void> => {
      e.preventDefault();
      setIsLoading(true);

      try {
         const userCredential = await signUp(email, password);
         setError('');

         // Estrae l'uid dell'utente creato e salva info aggiuntive in Firestore.
         const uid: string = userCredential.user.uid;
         await setDoc(doc(db, 'users', uid), {
            username,
            email,
            createdAt: new Date(),
         });

         navigate('/dashboard');
      } catch (err: unknown) {
         console.error(err);
         const message: string = getErrorMessage(err);
         setError(message);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <AuthForm
         title="Registrazione"
         error={error}
         username={username}
         onUsernameChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value)
         }
         email={email}
         password={password}
         onEmailChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
         }
         onPasswordChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
         }
         onSubmit={handleSubmit}
         buttonLabel="Registrati"
         isLoading={isLoading}
      />
   );
};

export default Signup;
