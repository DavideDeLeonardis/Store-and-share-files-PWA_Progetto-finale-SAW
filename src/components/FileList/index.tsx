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
import { ref as storageRef, deleteObject } from 'firebase/storage';

import { FileData } from './interfaces.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { db, storage } from '../../firebase/firebaseConfig.ts';
import FileElement from './FileElement/index.tsx';

import styles from './index.module.scss';

const FileList: React.FC = () => {
   const { user } = useAuth();
   const [files, setFiles] = useState<FileData[]>([]);

   /**
    * Per sottoscriversi agli aggiornamenti dei file dell'utente in Firestore.
    * Se l'utente non è autenticato, l'effetto non viene eseguito.
    */
   useEffect(() => {
      if (!user) return;

      // Query per ottenere i file, filtrati per userId e ordinati dal più recente
      const db_query = query(
         collection(db, 'files'),
         where('userId', '==', user.uid),
         orderBy('createdAt', 'desc')
      );

      // Sottoscrizione in tempo reale agli aggiornamenti dei file
      const unsubscribe = onSnapshot(db_query, (snapshot) => {
         const fileList: FileData[] = [];

         snapshot.forEach((docSnap) =>
            fileList.push({
               docId: docSnap.id,
               ...(docSnap.data() as Omit<FileData, 'docId'>),
            })
         );

         setFiles(fileList);
      });

      // Unsubscribe al dismount del componente, o cambio user
      return () => unsubscribe();
   }, [user]);

   const handleDelete = async (file: FileData): Promise<void> => {
      if (!user) return;

      try {
         // Elimina il documento del file in Firestore
         await deleteDoc(doc(db, 'files', file.docId));

         // Determina il path del file nello storage usando file.path se presente, altrimenti lo costruisce
         const filePath: string = file.path || `files/${user.uid}/${file.name}`;
         const storageReference = storageRef(storage, filePath);

         // Elimina il file dallo storage
         await deleteObject(storageReference);
      } catch (error) {
         console.error('Errore nell’eliminazione del file:', error);
      }
   };

   const file_list = files.map((file) => (
      <FileElement key={file.docId} file={file} onDelete={handleDelete} />
   ));

   return (
      <div className={styles.fileListContainer}>
         <h3>I miei file caricati</h3>

         {files.length === 0 ? (
            <p>Nessun file caricato</p>
         ) : (
            <ul className={styles.fileList}>{file_list}</ul>
         )}
      </div>
   );
};

export default FileList;
