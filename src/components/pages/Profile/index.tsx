import React from 'react';
import { Link } from 'react-router-dom';

import ResetPasswordButton from './ResetPasswordButton.tsx';
import DeleteAllFilesButton from './DeleteAllFilesButton.tsx';
import DeleteProfileButton from './DeleteProfileButton.tsx';

import styles from './index.module.scss';

const Profile: React.FC = () => {
   return (
      <div className={styles.profileContainer}>
         <h1 className={styles.profileTitle}>Profilo</h1>
         
         <div className={styles.buttonContainer}>
            <ResetPasswordButton />
            <DeleteAllFilesButton />
            <DeleteProfileButton />
         </div>

         <p className={styles.backLink}>
            <Link to="/dashboard">Torna alla Dashboard</Link>
         </p>
      </div>
   );
};

export default Profile;
