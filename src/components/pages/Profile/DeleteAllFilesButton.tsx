import React, { useState } from 'react';
import {
   collection,
   getDocs,
   query,
   where,
   deleteDoc,
   doc,
} from 'firebase/firestore';
import { ref as storageRef, deleteObject } from 'firebase/storage';

import { useAuth } from '../../../contexts/AuthContext.tsx';
import { db, storage } from '../../../firebase/firebaseConfig.ts';
import Button from '../../layout/Button/index.tsx';

import styles from './index.module.scss';

const DeleteAllFilesButton: React.FC = () => {
   const { user } = useAuth();

   // Stati per la gestione della conferma di eliminazione e del messaggio di azione
   const [filesDeleteConfirm, setFilesDeleteConfirm] = useState<boolean>(false);
   const [actionMessage, setActionMessage] = useState<string>('');
   const [isDeleting, setIsDeleting] = useState<boolean>(false);

   /**
    * Gestisce l'eliminazione di tutti i file.
    * La prima pressione imposta lo stato di conferma; la seconda esegue l'operazione.
    */
   const handleDeleteAllFiles = async (): Promise<void> => {
      // Se l'utente non è autenticato o la conferma è già attiva, return
      if (!user) return;
      if (!filesDeleteConfirm) {
         setFilesDeleteConfirm(true);
         setActionMessage(
            "Clicca nuovamente per confermare l'eliminazione di tutti i file."
         );
         return;
      }
      setIsDeleting(true);

      try {
         // Query per ottenere tutti i file dell'utente
         const q = query(
            collection(db, 'files'),
            where('userId', '==', user.uid)
         );
         const querySnapshot = await getDocs(q);

         const errors: string[] = [];

         // Esegue l'eliminazione per ciascun file
         const deleteFilesPromises = querySnapshot.docs.map(async (docSnap) => {
            try {
               const fileData = docSnap.data();
               const filePath: string =
                  fileData.path || `files/${user.uid}/${fileData.name}`;
               const fileStorageRef = storageRef(storage, filePath);
               await deleteObject(fileStorageRef);
               await deleteDoc(doc(db, 'files', docSnap.id));
            } catch (error: any) {
               if (error.code === 'storage/object-not-found') {
                  console.warn(
                     `File non trovato, considerato eliminato: ${docSnap.id}`
                  );
                  await deleteDoc(doc(db, 'files', docSnap.id));
               } else {
                  console.error(
                     `Errore nell'eliminazione del file ${docSnap.id}:`,
                     error.message
                  );
                  errors.push(
                     `Errore con il file ${docSnap.id} (${error.message})`
                  );
               }
            }
         });

         // Attende il completamento di tutte le eliminazioni.
         await Promise.all(deleteFilesPromises);

         if (errors.length > 0)
            setActionMessage(
               `Alcuni file non sono stati eliminati: ${errors.join(', ')}`
            );
         else setActionMessage('Tutti i file sono stati eliminati.');

         setFilesDeleteConfirm(false);
      } catch (error) {
         console.error("Errore nell'eliminazione dei file:", error);
         setActionMessage("Errore nell'eliminazione dei file.");
      } finally {
         setIsDeleting(false);
      }
   };

   return (
      <>
         <Button
            onClick={handleDeleteAllFiles}
            className={styles.deleteButton}
            disabled={isDeleting}
         >
            Elimina Tutti i File
         </Button>

         {isDeleting && <div className={styles.spinner} />}

         {actionMessage && (
            <p className={styles.actionMessage}>{actionMessage}</p>
         )}
      </>
   );
};

export default DeleteAllFilesButton;
