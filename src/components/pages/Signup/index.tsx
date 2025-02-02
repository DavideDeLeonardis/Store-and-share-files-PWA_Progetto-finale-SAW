import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';

import { useAuth } from '../../../contexts/AuthContext.tsx';
import { db } from '../../../firebase/firebaseConfig.ts';
import AuthForm from '../../AuthForm/index.tsx';

const Signup: React.FC = () => {
   const { signUp } = useAuth();
   const navigate = useNavigate();

   const [username, setUsername] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         const userCredential = await signUp(email, password);
         setError('');

         const uid = userCredential.user.uid;
         await setDoc(doc(db, 'users', uid), {
            username,
            email,
            createdAt: new Date(),
         });

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
         username={username}
         onUsernameChange={(e) => setUsername(e.target.value)}
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
