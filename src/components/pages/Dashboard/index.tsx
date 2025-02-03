import React from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../../contexts/AuthContext.tsx';
import UploadFile from '../../UploadFile/index.tsx';
import FileList from '../../FileList/index.tsx';
import Logout from '../../Logout/index.tsx';

import styles from './index.module.scss';

const Dashboard: React.FC = () => {
   const { user, profile } = useAuth();

   return (
      <div className={styles.dashboardContainer}>
         <div className={styles.dashHeader}>
            <h1 className={styles.dashboardTitle}>Dashboard</h1>
            <div className={styles.navLinks}>
               <Link to="/profile" className={styles.profileLink}>
                  Profilo
               </Link>
               <Logout />
            </div>
         </div>

         {user && (
            <div className={styles.userInfo}>
               Ciao <strong>{profile ? profile.username : 'Utente'}</strong>,
               carica un file PDF per iniziare!
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
