import React, { useState } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';

import { useAuth } from '../../../contexts/AuthContext.tsx';
import { db } from '../../../firebase/firebaseConfig.ts';
import Button from '../../layout/Button/index.tsx';

import styles from './index.module.scss';

const DeleteProfileButton: React.FC = () => {
   const { user } = useAuth();
   const [profileDeleteConfirm, setProfileDeleteConfirm] =
      useState<boolean>(false);
   const [actionMessage, setActionMessage] = useState<string>('');

   /**
    * Gestisce l'eliminazione del profilo.
    * La prima pressione imposta lo stato di conferma; la seconda esegue l'eliminazione.
    */
   const handleDeleteProfile = async (): Promise<void> => {
      // Se l'utente non è autenticato o la conferma è già attiva, return
      if (!user) return;
      if (!profileDeleteConfirm) {
         setProfileDeleteConfirm(true);
         setActionMessage(
            "Clicca nuovamente per confermare l'eliminazione del profilo."
         );
         return;
      }

      // Elimina il profilo e l'utente da Firebase
      try {
         await deleteDoc(doc(db, 'users', user.uid));
         await deleteUser(user);
         setActionMessage('Profilo eliminato con successo.');
      } catch (error) {
         console.error("Errore nell'eliminazione del profilo:", error);
         setActionMessage(
            "Errore nell'eliminazione del profilo. Necessaria una re-autenticazione."
         );
      }
   };

   return (
      <>
         <Button
            onClick={handleDeleteProfile}
            className={styles.deleteButton}
            children="Elimina Profilo"
         />

         {actionMessage && (
            <p className={styles.actionMessage}>{actionMessage}</p>
         )}
      </>
   );
};

export default DeleteProfileButton;
