import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import Logout from '../Logout/index.tsx';

import styles from './index.module.scss';

interface NavBarProps {
   currentPage: 'dashboard' | 'profile';
}

// Navbar con props 'dashboard' | 'profile'
const NavBar: FC<NavBarProps> = ({ currentPage }) => {
   // Definizione delle etichette per i link di navigazione in base alla pagina corrente
   const { leftLabel, switchLabel, switchLink } =
      currentPage === 'dashboard'
         ? {
              leftLabel: 'Dashboard',
              switchLabel: 'Profilo',
              switchLink: '/profile',
           }
         : {
              leftLabel: 'Profilo',
              switchLabel: 'Dashboard',
              switchLink: '/dashboard',
           };

   return (
      <nav className={styles.navbar}>
         <div className={styles.navbarLeft}>
            <h2>{leftLabel}</h2>
         </div>

         <div className={styles.navbarRight}>
            <Link to={switchLink} className={styles.switchButton}>
               {switchLabel}
            </Link>
            <Logout />
         </div>
      </nav>
   );
};

export default NavBar;
