import React from 'react';
import { useAuth } from '../../contexts/AuthContext.tsx';

import Button from '../layout/Button/index.tsx';

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
      <Button
         className={styles.logoutButton}
         onClick={handleLogout}
         children={'Logout'}
         variant="danger"
      />
   );
};

export default Logout;
