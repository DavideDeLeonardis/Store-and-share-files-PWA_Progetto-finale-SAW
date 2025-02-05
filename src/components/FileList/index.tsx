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
} from 'firebase/firestore';
import { ref as storageRef, deleteObject } from 'firebase/storage';

import { db, storage } from '../../firebase/firebaseConfig.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';

import styles from './index.module.scss';

// Worker per il rendering dei PDF
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

interface FileData {
   docId: string; // ID del documento in Firestore
   name: string;
   url: string; // URL del file nello storage
   userId: string;
   path?: string; // Percorso del file nello storage
}

const FileList: React.FC = () => {
   const { user } = useAuth();
   const [files, setFiles] = useState<FileData[]>([]);
   // State per tenere traccia degli errori di caricamento dell'anteprima del PDF
   const [errorPreview, setErrorPreview] = useState<{ [key: string]: boolean }>(
      {}
   );

   /**
    * Per sottoscriversi agli aggiornamenti dei file dell'utente in Firestore.
    * Se l'utente non è autenticato, l'effetto non viene eseguito.
    */
   useEffect(() => {
      if (!user) return;

      // Riferimento alla collection "files" e query per filtrare per userId
      const filesRef = collection(db, 'files');
      const q = query(filesRef, where('userId', '==', user.uid));

      // Sottoscrizione in tempo reale agli aggiornamenti dei file
      const unsubscribe = onSnapshot(q, (snapshot) => {
         const fileList: FileData[] = [];
         snapshot.forEach((docSnap) =>
            fileList.push({
               docId: docSnap.id,
               ...(docSnap.data() as Omit<FileData, 'docId'>),
            })
         );
         setFiles(fileList);
      });

      // Cleanup della sottoscrizione al dismount del componente
      return () => unsubscribe();
   }, [user]);

   const handleDelete = async (file: FileData): Promise<void> => {
      if (!user) return;

      try {
         // Elimina il documento del file in Firestore
         await deleteDoc(doc(db, 'files', file.docId));

         // Determina il percorso del file nello storage usando file.path se presente, altrimenti lo costruisce
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
                           {errorPreview[file.docId] ? (
                              <p className={styles.errorMessage}>
                                 Anteprima non disponibile
                              </p>
                           ) : (
                              <Document
                                 file={file.url}
                                 onLoadError={() =>
                                    setErrorPreview((prev) => ({
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
                           <button className={styles.viewButton}>
                              <Link
                                 to={file.url}
                                 target="_blank"
                                 rel="noreferrer"
                              >
                                 Visualizza
                              </Link>
                           </button>

                           <button
                              className={styles.deleteButton}
                              onClick={() => handleDelete(file)}
                           >
                              Elimina
                           </button>
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
