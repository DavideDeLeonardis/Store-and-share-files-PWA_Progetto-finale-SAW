import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../../contexts/AuthContext.tsx';
import AuthForm from '../../AuthForm/index.tsx';

const Signup: React.FC = () => {
   const { signUp } = useAuth();
   const navigate = useNavigate();

   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         await signUp(email, password);
         setError('');
         navigate('/dashboard');
      } catch (err) {
         console.error(err);
         setError('Errore nella registrazione');
      }
   };

   return (
      <AuthForm
         title="Registrazione"
         error={error}
         email={email}
         password={password}
         onEmailChange={(e) => setEmail(e.target.value)}
         onPasswordChange={(e) => setPassword(e.target.value)}
         onSubmit={handleSubmit}
         buttonLabel="Registrati"
      />
   );
};

export default Signup;
