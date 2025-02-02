import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
   updatePassword,
   deleteUser,
   EmailAuthProvider,
   reauthenticateWithCredential,
} from 'firebase/auth';
import {
   doc,
   deleteDoc,
   collection,
   getDocs,
   query,
   where,
} from 'firebase/firestore';
import { ref as storageRef, deleteObject } from 'firebase/storage';

import { useAuth } from '../../../contexts/AuthContext.tsx';
import { db, storage } from '../../../firebase/firebaseConfig.ts';

import styles from './index.module.scss';

const Profile: React.FC = () => {
   const { user } = useAuth();

   const [showReset, setShowReset] = useState(false);
   const [newPassword, setNewPassword] = useState('');
   const [currentPassword, setCurrentPassword] = useState('');
   const [reauthRequired, setReauthRequired] = useState(false);
   const [resetStatus, setResetStatus] = useState<string>('');
   const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

   const [profileDeleteConfirm, setProfileDeleteConfirm] = useState(false);
   const [filesDeleteConfirm, setFilesDeleteConfirm] = useState(false);
   const [actionMessage, setActionMessage] = useState<string>('');

   const handleResetPassword = async () => {
      if (!user) return;
      if (!newPassword) {
         setResetStatus('Inserisci una nuova password.');
         return;
      }
      if (newPassword.length < 6) {
         setResetStatus('La password deve contenere almeno 6 caratteri.');
         return;
      }
      setIsUpdatingPassword(true);
      try {
         if (!reauthRequired) {
            await updatePassword(user, newPassword);
            setResetStatus('Password aggiornata con successo!');
            setNewPassword('');
            setShowReset(false);
         } else {
            if (!currentPassword) {
               setResetStatus(
                  'Inserisci la tua password attuale per re-autenticarti.'
               );
               return;
            }
            const credential = EmailAuthProvider.credential(
               user.email!,
               currentPassword
            );
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            setResetStatus('Password aggiornata con successo!');
            setNewPassword('');
            setCurrentPassword('');
            setShowReset(false);
            setReauthRequired(false);
         }
      } catch (error: any) {
         console.error('Errore nel reset della password:', error);
         if (error.code === 'auth/requires-recent-login') {
            setResetStatus(
               'Re-autenticazione richiesta. Inserisci la tua password attuale.'
            );
            setReauthRequired(true);
         } else {
            setResetStatus('Errore nel reset della password. Riprova.');
         }
      } finally {
         setIsUpdatingPassword(false);
      }
   };

   const handleDeleteProfile = async () => {
      if (!user) return;
      if (!profileDeleteConfirm) {
         setProfileDeleteConfirm(true);
         setActionMessage(
            "Clicca nuovamente per confermare l'eliminazione del profilo."
         );
         return;
      }
      try {
         await deleteDoc(doc(db, 'users', user.uid));
         await deleteUser(user);
         setActionMessage('Profilo eliminato con successo.');
      } catch (error) {
         console.error("Errore nell'eliminazione del profilo:", error);
         setActionMessage(
            "Errore nell'eliminazione del profilo. Potrebbe essere necessaria una re-autenticazione."
         );
      }
   };

   const handleDeleteAllFiles = async () => {
      if (!user) return;
      if (!filesDeleteConfirm) {
         setFilesDeleteConfirm(true);
         setActionMessage(
            "Clicca nuovamente per confermare l'eliminazione di tutti i file."
         );
         return;
      }
      try {
         const q = query(
            collection(db, 'files'),
            where('userId', '==', user.uid)
         );
         const querySnapshot = await getDocs(q);
         const deletePromises = querySnapshot.docs.map(async (docSnap) => {
            const fileData = docSnap.data();
            const filePath =
               fileData.path || `files/${user.uid}/${fileData.name}`;
            const fileStorageRef = storageRef(storage, filePath);
            await deleteObject(fileStorageRef);
            await deleteDoc(doc(db, 'files', docSnap.id));
         });
         await Promise.all(deletePromises);
         setActionMessage('Tutti i file sono stati eliminati.');
         setFilesDeleteConfirm(false);
      } catch (error) {
         console.error("Errore nell'eliminazione dei file:", error);
         setActionMessage("Errore nell'eliminazione dei file.");
      }
   };

   return (
      <div className={styles.profileContainer}>
         <h1 className={styles.profileTitle}>Profilo</h1>

         <div className={styles.buttonContainer}>
            <div className={styles.resetWrapper}>
               <button
                  onClick={() => {
                     setShowReset(!showReset);
                     setResetStatus('');
                     setReauthRequired(false);
                  }}
                  className={styles.resetButton}
               >
                  Reimposta Password
               </button>

               {showReset && (
                  <div className={styles.resetSection}>
                     {reauthRequired && (
                        <input
                           type="password"
                           placeholder="Password attuale"
                           value={currentPassword}
                           onChange={(e) => setCurrentPassword(e.target.value)}
                           className={styles.resetInput}
                        />
                     )}
                     <input
                        type="password"
                        placeholder="Nuova password (min 6 caratteri)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={styles.resetInput}
                     />
                     <button
                        onClick={handleResetPassword}
                        className={styles.confirmResetButton}
                        disabled={isUpdatingPassword}
                     >
                        Conferma
                     </button>
                     {isUpdatingPassword && <div className={styles.spinner} />}
                  </div>
               )}
               {resetStatus && (
                  <p className={styles.statusMessage}>{resetStatus}</p>
               )}
            </div>

            <button
               onClick={handleDeleteAllFiles}
               className={styles.deleteButton}
            >
               Elimina Tutti i File
            </button>

            <button
               onClick={handleDeleteProfile}
               className={styles.deleteButton}
            >
               Elimina Profilo
            </button>

            {actionMessage && (
               <p className={styles.actionMessage}>{actionMessage}</p>
            )}
         </div>

         <p className={styles.backLink}>
            <Link to="/dashboard">Torna alla Dashboard</Link>
         </p>
      </div>
   );
};

export default Profile;
