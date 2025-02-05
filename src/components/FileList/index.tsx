'use client';

import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Link } from 'react-router-dom';
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

import { db, storage } from '../../firebase/firebaseConfig.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';
import Button from '../layout/Button/index.tsx';

import styles from './index.module.scss';

// Worker per il rendering dei PDF
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

interface FileData {
   docId: string; // ID del documento in Firestore
   name: string;
   url: string; // URL del file nello storage
   userId: string;
   path?: string; // Percorso del file nello storage
   createdAt?: any; // Timestamp Firestore
}

const FileList: React.FC = () => {
   const { user } = useAuth();
   // State per db files e errori di caricamento dell'anteprima del PDF
   const [files, setFiles] = useState<FileData[]>([]);
   const [errPreview, setErrPreview] = useState<{ [key: string]: boolean }>({});

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

   return (
      <div className={styles.fileListContainer}>
         <h3 style={{ marginBottom: '20px' }}>I miei file caricati</h3>

         {files.length === 0 ? (
            <p>Nessun file caricato</p>
         ) : (
            <ul className={styles.fileList}>
               {/* Elementi della lista files */}
               {files.map((file) => (
                  <li key={file.docId} className={styles.fileItem}>
                     <div className={styles.fileContent}>
                        <strong className={styles.fileName}>{file.name}</strong>

                        <div className={styles.pdfPreview}>
                           {errPreview[file.docId] ? (
                              <p className={styles.errorMessage}>
                                 Anteprima non disponibile
                              </p>
                           ) : (
                              <Document
                                 file={file.url}
                                 onLoadError={() =>
                                    setErrPreview((prev) => ({
                                       ...prev,
                                       [file.docId]: true,
                                    }))
                                 }
                              >
                                 <Page pageNumber={1} width={300} />
                              </Document>
                           )}
                        </div>

                        {/* Buttons view e delete file */}
                        <div className={styles.buttonGroup}>
                           <Link to={file.url} target="_blank" rel="noreferrer">
                              <Button
                                 className={styles.viewButton}
                                 children={'Visualizza'}
                              />
                           </Link>

                           <Button
                              className={styles.deleteButton}
                              onClick={() => handleDelete(file)}
                              children={'Elimina'}
                              variant="danger"
                           />
                        </div>
                     </div>
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
};

export default FileList;
