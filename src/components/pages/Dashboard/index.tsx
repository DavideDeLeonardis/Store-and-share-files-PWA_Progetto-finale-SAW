import React from 'react';

import { useAuth } from '../../../contexts/AuthContext.tsx';
import NavBar from '../../NavBar/index.tsx';
import UploadFile from '../../UploadFile/index.tsx';
import FileList from '../../FileList/index.tsx';

import styles from './index.module.scss';

const Dashboard: React.FC = () => {
   const { user, profile } = useAuth();

   return (
      <div className={styles.dashboardContainer}>
         <NavBar currentPage="dashboard" />

         {user && (
            <div className={styles.userInfo}>
               Ciao <strong>{profile ? profile.username : 'Utente'}</strong>,
               carica un file per iniziare! (verranno visualizzati solo i file PDF)
            </div>
         )}

         <div className={styles.section}>
            <UploadFile />
         </div>

         <div className={styles.section}>
            <FileList />
         </div>
      </div>
   );
};

export default Dashboard;
