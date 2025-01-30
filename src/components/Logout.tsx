import React from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';

const Logout: React.FC = () => {
   const { logout } = useAuth();

   const handleLogout = async () => {
      try {
         await logout();
      } catch (err) {
         console.error(err);
      }
   };

   return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
