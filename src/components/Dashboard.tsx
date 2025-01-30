import React from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import Logout from './Logout.tsx';

const Dashboard: React.FC = () => {
   const { user } = useAuth();

   return (
      <div>
         <h1>Dashboard</h1>
         {user ? (
            <div>
               <p>
                  Ciao, <strong>{user.email}</strong>. Sei loggato!
               </p>
               <Logout />
            </div>
         ) : (
            <p>Non dovresti essere qui (nessun utente loggato).</p>
         )}
      </div>
   );
};

export default Dashboard;
