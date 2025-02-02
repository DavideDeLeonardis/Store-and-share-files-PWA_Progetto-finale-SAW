import React from 'react';
import { Link } from 'react-router-dom';

import styles from './index.module.scss';

const LandingPage: React.FC = () => {
   return (
      <div className={styles.landingContainer}>
         <h1 className={styles.title}>Benvenuto!</h1>

         <div className={styles.buttonContainer}>
            <Link to="/login" className={styles.linkButton}>
               Login
            </Link>
            <Link to="/signup" className={styles.linkButton}>
               Registrati
            </Link>
         </div>

         <p className={styles.footerNote}>
            Inizia subito a caricare i tuoi file in modo semplice e portali
            sempre con te!
         </p>
      </div>
   );
};

export default LandingPage;
