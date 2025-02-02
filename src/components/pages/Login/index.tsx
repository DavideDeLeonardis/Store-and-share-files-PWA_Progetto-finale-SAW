import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../../contexts/AuthContext.tsx';
import AuthForm from '../../AuthForm/index.tsx';
import useFirebaseErrorMessage from '../../../hooks/useFirebaseErrorMessage.ts';

const Login: React.FC = () => {
   const { login } = useAuth();
   const navigate = useNavigate();
   const { getErrorMessage } = useFirebaseErrorMessage();

   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         await login(email, password);
         setError('');
         navigate('/dashboard');
      } catch (err) {
         console.error(err);
         const message = getErrorMessage(err);
         setError(message);
      }
   };

   return (
      <AuthForm
         title="Login"
         error={error}
         email={email}
         password={password}
         onEmailChange={(e) => setEmail(e.target.value)}
         onPasswordChange={(e) => setPassword(e.target.value)}
         onSubmit={handleSubmit}
         buttonLabel="Accedi"
      />
   );
};

export default Login;
