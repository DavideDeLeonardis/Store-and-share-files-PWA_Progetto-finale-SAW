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

import styles from './index.module.scss';

/**
 * Componente DeleteAllFilesButton
 *
 * Permette all'utente di eliminare tutti i file caricati.
 * Richiede una conferma a doppio click per evitare eliminazioni accidentali.
 */
const DeleteAllFilesButton: React.FC = () => {
   const { user } = useAuth();
   const [filesDeleteConfirm, setFilesDeleteConfirm] = useState<boolean>(false);
   const [actionMessage, setActionMessage] = useState<string>('');

   /**
    * Gestisce l'eliminazione di tutti i file caricati dall'utente.
    * Al secondo click, elimina ogni file dallo Storage e il relativo documento in Firestore.
    */
   const handleDeleteAllFiles = async (): Promise<void> => {
      if (!user) return;

      if (!filesDeleteConfirm) {
         setFilesDeleteConfirm(true);
         setActionMessage(
            "Clicca nuovamente per confermare l'eliminazione di tutti i file."
         );
         return;
      }

      try {
         // Query per ottenere tutti i file dell'utente
         const q = query(
            collection(db, 'files'),
            where('userId', '==', user.uid)
         );
         const querySnapshot = await getDocs(q);

         const errors: string[] = [];

         // Esegue l'eliminazione per ciascun file
         const deletePromises = querySnapshot.docs.map(async (docSnap) => {
            try {
               const fileData = docSnap.data();
               const filePath: string =
                  fileData.path || `files/${user.uid}/${fileData.name}`;
               await deleteObject(storageRef(storage, filePath));
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
         await Promise.all(deletePromises);

         if (errors.length > 0)
            setActionMessage(
               `Alcuni file non sono stati eliminati: ${errors.join(', ')}`
            );
         else setActionMessage('Tutti i file sono stati eliminati.');

         setFilesDeleteConfirm(false);
      } catch (error) {
         console.error("Errore nell'eliminazione dei file:", error);
         setActionMessage("Errore nell'eliminazione dei file.");
      }
   };

   return (
      <>
         <button onClick={handleDeleteAllFiles} className={styles.deleteButton}>
            Elimina Tutti i File
         </button>

         {actionMessage && (
            <p className={styles.actionMessage}>{actionMessage}</p>
         )}
      </>
   );
};

export default DeleteAllFilesButton;
