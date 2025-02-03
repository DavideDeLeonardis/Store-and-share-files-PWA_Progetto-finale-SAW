import React from 'react';

import NavBar from '../../NavBar/index.tsx';
import ResetPasswordButton from './ResetPasswordButton.tsx';
import DeleteAllFilesButton from './DeleteAllFilesButton.tsx';
import DeleteProfileButton from './DeleteProfileButton.tsx';

import styles from './index.module.scss';

const Profile: React.FC = () => {
   return (
      <div className={styles.profileContainer}>
         <NavBar currentPage="profile" />

         <div className={styles.buttonContainer}>
            <ResetPasswordButton />
            <DeleteAllFilesButton />
            <DeleteProfileButton />
         </div>
      </div>
   );
};

export default Profile;
