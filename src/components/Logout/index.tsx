// src/components/Logout.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import styles from './index.module.scss';

const Logout: React.FC = () => {
   const { logout } = useAuth();

   const handleLogout = async () => {
      try {
         await logout();
      } catch (e) {
         console.error(e);
      }
   };

   return (
      <button onClick={handleLogout} className={styles.logoutButton}>
         Logout
      </button>
   );
};

export default Logout;
