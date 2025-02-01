import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../../contexts/AuthContext.tsx';
import AuthForm from '../../AuthForm/index.tsx';

const Login: React.FC = () => {
   const { login } = useAuth();
   const navigate = useNavigate();

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
         setError('Errore nel login');
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
