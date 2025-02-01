import React from 'react';

import { useAuth } from '../../../contexts/AuthContext.tsx';
import UploadFile from '../../UploadFile/index.tsx';
import FileList from '../../FileList/index.tsx';
import Logout from '../../Logout/index.tsx';

import styles from './index.module.scss';

const Dashboard: React.FC = () => {
   const { user } = useAuth();

   return (
      <div className={styles.dashboardContainer}>
         <div className={styles.dashHeader}>
            <h1 className={styles.dashboardTitle}>Dashboard</h1>
            <Logout />
         </div>

         {user && (
            <div className={styles.userInfo}>
               <p>
                  Ciao, <strong>{user.email}</strong>
               </p>
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
