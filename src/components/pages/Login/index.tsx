import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../../contexts/AuthContext.tsx';
import AuthForm from '../../AuthForm/index.tsx';
import useFirebaseErrorMessage from '../../../hooks/useFirebaseErrorMessage.ts';

const Login: React.FC = () => {
   const { login, signInWithGoogle } = useAuth();
   const navigate = useNavigate(); // Hook di React Router
   const { getErrorMessage } = useFirebaseErrorMessage();

   const [email, setEmail] = useState<string>('');
   const [password, setPassword] = useState<string>('');
   const [error, setError] = useState<string>('');
   const [isLoading, setIsLoading] = useState<boolean>(false);

   const handleSubmit = async (
      e: React.FormEvent<HTMLFormElement>
   ): Promise<void> => {
      e.preventDefault();
      setIsLoading(true);

      // Login con Firebase
      try {
         await login(email, password);
         setError('');
         navigate('/dashboard');
      } catch (err: unknown) {
         console.error(err);
         const message: string = getErrorMessage(err);
         setError(message);
      } finally {
         setIsLoading(false);
      }
   };

   // Login con Google
   const handleGoogle = async () => {
      setIsLoading(true);

      try {
         await signInWithGoogle();
         navigate('/dashboard');
      } catch (err) {
         console.error(err);
         setError(getErrorMessage(err));
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <AuthForm
         title="Login"
         error={error}
         email={email}
         password={password}
         onEmailChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
         }
         onPasswordChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
         }
         onSubmit={handleSubmit}
         onGoogleSignIn={handleGoogle}
         buttonLabel="Accedi"
         isLoading={isLoading}
      />
   );
};

export default Login;
