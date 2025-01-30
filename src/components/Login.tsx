import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';

const Login: React.FC = () => {
   const { login } = useAuth();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const navigate = useNavigate();


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
      <div>
         <h2>Login</h2>
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
            <button type="submit">Accedi</button>
         </form>
      </div>
   );
};

export default Login;
