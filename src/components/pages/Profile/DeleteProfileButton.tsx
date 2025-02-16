import React, { useState } from 'react';
import {
   collection,
   query,
   where,
   getDocs,
   doc,
   deleteDoc,
} from 'firebase/firestore';
import {
   ref as storageRef,
   getDownloadURL,
   deleteObject,
} from 'firebase/storage';
import { deleteUser } from 'firebase/auth';

import { useAuth } from '../../../contexts/AuthContext.tsx';
import { db, storage } from '../../../firebase/firebaseConfig.ts';
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
            "Clicca nuovamente per confermare l'eliminazione del profilo. \nTUTTI i tuoi file verranno eliminati permanentemente."
         );
         return;
      }

      try {
         // Recupera tutti i file dell'utente dalla collezione 'files'
         const querySnapshot = await getDocs(
            query(collection(db, 'files'), where('userId', '==', user.uid))
         );

         // Per ogni file, verifica se esiste su Storage e se sì, lo elimina
         for (const fileDoc of querySnapshot.docs) {
            const fileData = fileDoc.data() as {
               name: string;
               path?: string;
               userId: string;
            };
            const filePath =
               fileData.path || `files/${user.uid}/${fileData.name}`;
            const storageReference = storageRef(storage, filePath);

            let fileExists = true;
            try {
               await getDownloadURL(storageReference); // Controlla se esiste
            } catch (err) {
               fileExists = false;
               console.warn('Il file non esiste più nello Storage:', filePath);
            }

            // Se il file esiste, lo eliminiamo dallo Storage
            if (fileExists)
               try {
                  await deleteObject(storageReference);
               } catch (err) {
                  console.error('Errore eliminazione file nello Storage:', err);
               }

            // Elimina il documento Firestore corrispondente
            await deleteDoc(fileDoc.ref);
         }

         // Elimina il documento del profilo utente e l'account utente
         await deleteDoc(doc(db, 'users', user.uid));
         await deleteUser(user);
      } catch (e) {
         setActionMessage(
            'Errore nell’eliminazione del profilo. Necessaria una re-autenticazione.'
         );
      }
   };

   return (
      <>
         <Button onClick={handleDeleteProfile} className={styles.deleteButton}>
            Elimina Profilo
         </Button>

         {actionMessage && (
            <p className={styles.actionMessage}>{actionMessage}</p>
         )}
      </>
   );
};

export default DeleteProfileButton;
