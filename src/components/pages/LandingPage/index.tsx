import React from 'react';
import { Link } from 'react-router-dom';

import styles from './index.module.scss';

const LandingPage: React.FC = () => {
   return (
      <div className={styles.landingContainer}>
         <h1 className={styles.title}>Benvenuto!</h1>

         <p className={styles.footerNote}>
            Store & Share Files PWA è la piattaforma per archiviare, gestire e
            condividere i tuoi documenti in modo semplice e sicuro. Con la
            nostra app potrai caricare, visualizzare e accedere ai tuoi file
            ovunque tu sia. Installa l'app sul tuo dispositivo e porta con te
            tutti i tuoi file.
         </p>

         <div className={styles.buttonContainer}>
            <Link to="/login" className={styles.linkButton}>
               Login
            </Link>
            <Link to="/signup" className={styles.linkButton}>
               Registrati
            </Link>
         </div>
      </div>
   );
};

export default LandingPage;
