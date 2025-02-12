import React, { useEffect, useState } from 'react';
import {
   collection,
   query,
   where,
   onSnapshot,
   doc,
   deleteDoc,
   orderBy,
} from 'firebase/firestore';
import {
   ref as storageRef,
   deleteObject,
   getDownloadURL,
} from 'firebase/storage';

import { FileData } from './interfaces.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { db, storage } from '../../firebase/firebaseConfig.ts';
import FileElement from './FileElement/index.tsx';
import Spinner from '../layout/Spinner/index.tsx';

import styles from './index.module.scss';

const FileList: React.FC = () => {
   const { user } = useAuth();
   const [files, setFiles] = useState<FileData[]>([]);
   const [isLoading, setIsLoading] = useState<boolean>(true);

   /**
    * Per sottoscriversi agli aggiornamenti dei file dell'utente in Firestore.
    * Se l'utente non è autenticato, l'effetto non viene eseguito.
    */
   useEffect(() => {
      if (!user) return;

      setIsLoading(true);

      // Query per ottenere i file, filtrati per userId e ordinati dal più recente
      const db_query = query(
         collection(db, 'files'),
         where('userId', '==', user.uid),
         orderBy('createdAt', 'desc')
      );

      // Sottoscrizione in tempo reale agli aggiornamenti dei file
      const unsubscribe = onSnapshot(db_query, async (snapshot) => {
         const fileList: FileData[] = [];

         // Verifica ogni file se esiste nello Storage prima di aggiungerlo alla lista
         for (const docSnap of snapshot.docs) {
            const fileData = {
               docId: docSnap.id,
               ...(docSnap.data() as Omit<FileData, 'docId'>),
            };

            // Costruisci il riferimento al file nello Storage
            const filePath: string =
               fileData.path || `files/${user.uid}/${fileData.name}`;
            const storageReference = storageRef(storage, filePath);

            try {
               // Controlla se il file esiste nello Storage
               await getDownloadURL(storageReference);
               fileList.push(fileData); // Se esiste, lo aggiunge alla lista
            } catch (error) {
               console.warn(
                  'File non trovato nello Storage, eliminazione da Firestore:',
                  filePath
               );
               // Elimina il riferimento da Firestore
               await deleteDoc(doc(db, 'files', fileData.docId));
            }
         }

         setFiles(fileList);
         setIsLoading(false);
      });

      // Unsubscribe al dismount del componente, o cambio user
      return () => unsubscribe();
   }, [user]);

   const handleDelete = async (file: FileData): Promise<void> => {
      if (!user) return;

      try {
         // Percorso del file nello storage
         const filePath: string = file.path || `files/${user.uid}/${file.name}`;
         const storageReference = storageRef(storage, filePath);

         let fileExists = true;
         try {
            await getDownloadURL(storageReference);
         } catch (error) {
            fileExists = false;
            console.warn('Il file non esiste più nello Storage:', filePath);
         }

         // Se il file esiste, lo elimina dallo Storage
         if (fileExists)
            try {
               await deleteObject(storageReference);
            } catch (err) {
               console.error('Errore nell’eliminazione dallo Storage:', err);
            }

         // Elimina il riferimento al file da Firestore
         await deleteDoc(doc(db, 'files', file.docId));
      } catch (error) {
         console.error('Errore nell’eliminazione del file:', error);
      }
   };

   return (
      <div className={styles.fileListContainer}>
         <h3>I miei file caricati</h3>

         {isLoading ? (
            <Spinner className={styles.spinner} />
         ) : files.length === 0 ? (
            <p>Nessun file caricato</p>
         ) : (
            <ul className={styles.fileList}>
               {files.map((file) => (
                  <FileElement
                     key={file.docId}
                     file={file}
                     onDelete={handleDelete}
                  />
               ))}
            </ul>
         )}
      </div>
   );
};

export default FileList;
