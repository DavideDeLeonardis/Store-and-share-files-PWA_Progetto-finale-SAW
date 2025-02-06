import React, { useState } from 'react';
import {
   updatePassword,
   EmailAuthProvider,
   reauthenticateWithCredential,
} from 'firebase/auth';

import { useAuth } from '../../../contexts/AuthContext.tsx';
import Button from '../../layout/Button/index.tsx';

import styles from './index.module.scss';

const ResetPasswordButton: React.FC = () => {
   const { user } = useAuth();

   // State per mostrare l'input per il reset della password
   const [showReset, setShowReset] = useState<boolean>(false);

   const [newPassword, setNewPassword] = useState<string>('');
   const [currentPassword, setCurrentPassword] = useState<string>('');
   const [reauthRequired, setReauthRequired] = useState<boolean>(false);

   // State per mostrare lo stato del reset della password
   const [resetStatus, setResetStatus] = useState<string>('');
   const [isUpdatingPassword, setIsUpdatingPassword] = useState<boolean>(false);

   /**
    * Se la re-autenticazione è richiesta, verifica anche la password attuale.
    */
   const handleResetPassword = async (): Promise<void> => {
      // Se l'utente non è autenticato o la password è vuota o troppo corta, return
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

            // Controlla se la password attuale è corretta e la aggiorna
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
         <Button
            onClick={() => {
               setShowReset(!showReset);
               setResetStatus('');
               setReauthRequired(false);
            }}
         >
            Reimposta Password
         </Button>

         {showReset && (
            <div className={styles.resetSection}>
               {/* {Input per la password attuale} */}
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

               {/* Input per la nuova password */}
               <input
                  type="password"
                  placeholder="Nuova password (min 6 caratteri)"
                  value={newPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                     setNewPassword(e.target.value)
                  }
                  className={styles.resetInput}
               />

               <Button
                  onClick={handleResetPassword}
                  className={styles.confirmResetButton}
                  disabled={isUpdatingPassword}
               >
                  Conferma
               </Button>

               {/* Spinner */}
               {isUpdatingPassword && <div className={styles.spinner} />}
            </div>
         )}

         {/* Status */}
         {resetStatus && <p className={styles.statusMessage}>{resetStatus}</p>}
      </div>
   );
};

export default ResetPasswordButton;
