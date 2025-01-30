import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

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
      <div>
         <h2>Registrazione</h2>
         {error && <p style={{ color: 'red' }}>{error}</p>}
         <form onSubmit={handleSubmit}>
            <div>
               <label>Email</label>
               <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
               />
            </div>
            <div>
               <label>Password</label>
               <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
               />
            </div>
            <button type="submit">Registrati</button>
         </form>
      </div>
   );
};

export default Signup;
