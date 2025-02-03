import React, { useState } from 'react';
import {
   updatePassword,
   EmailAuthProvider,
   reauthenticateWithCredential,
} from 'firebase/auth';

import { useAuth } from '../../../contexts/AuthContext.tsx';

import styles from './index.module.scss';

const ResetPasswordButton: React.FC = () => {
   const { user } = useAuth();

   const [showReset, setShowReset] = useState<boolean>(false);
   const [newPassword, setNewPassword] = useState<string>('');
   const [currentPassword, setCurrentPassword] = useState<string>('');
   const [reauthRequired, setReauthRequired] = useState<boolean>(false);
   const [resetStatus, setResetStatus] = useState<string>('');
   const [isUpdatingPassword, setIsUpdatingPassword] = useState<boolean>(false);

   /**
    * Gestisce il reset della password.
    * Se la re-autenticazione è richiesta, verifica anche la password attuale.
    */
   const handleResetPassword = async (): Promise<void> => {
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
            // Aggiorna la password senza re-autenticazione
            await updatePassword(user, newPassword);

            setResetStatus('Password aggiornata con successo!');
            setNewPassword('');
            setShowReset(false);
         } else {
            // Se è richiesta la re-autenticazione, controlla la password attuale
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

   return (
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
                     onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setCurrentPassword(e.target.value)
                     }
                     className={styles.resetInput}
                  />
               )}

               <input
                  type="password"
                  placeholder="Nuova password (min 6 caratteri)"
                  value={newPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                     setNewPassword(e.target.value)
                  }
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

         {resetStatus && <p className={styles.statusMessage}>{resetStatus}</p>}
      </div>
   );
};

export default ResetPasswordButton;
