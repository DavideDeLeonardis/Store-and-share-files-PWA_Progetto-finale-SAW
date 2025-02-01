// src/components/FileList.tsx
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

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface FileData {
   docId: string;
   name: string;
   url: string;
   userId: string;
   path?: string;
}

const FileList: React.FC = () => {
   const { user } = useAuth();
   const [files, setFiles] = useState<FileData[]>([]);

   useEffect(() => {
      if (!user) return;

      const filesRef = collection(db, 'files');
      const q = query(filesRef, where('userId', '==', user.uid));

      const unsubscribe = onSnapshot(q, (snapshot) => {
         const fileList: FileData[] = [];
         snapshot.forEach((docSnap) => {
            fileList.push({
               docId: docSnap.id,
               ...(docSnap.data() as Omit<FileData, 'docId'>),
            });
         });
         setFiles(fileList);
      });

      return () => unsubscribe();
   }, [user]);

   const handleDelete = async (file: FileData) => {
      if (!user) return;
      try {
         await deleteDoc(doc(db, 'files', file.docId));
         const path = file.path || `files/${user.uid}/${file.name}`;
         const storageReference = storageRef(storage, path);
         await deleteObject(storageReference);
         console.log(`File ${file.name} eliminato con successo!`);
      } catch (error) {
         console.error('Errore nell’eliminazione del file:', error);
      }
   };

   return (
      <div className={styles.fileListContainer}>
         <h3 style={{ marginBottom: '20px' }}>I miei PDF caricati</h3>
         {files.length === 0 ? (
            <p>Nessun file caricato</p>
         ) : (
            <ul className={styles.fileList}>
               {files.map((file) => (
                  <li key={file.docId} className={styles.fileItem}>
                     <Link to={file.url} target="_blank" rel="noreferrer">
                        <strong className={styles.fileName}>{file.name}</strong>

                        <div className={styles.pdfPreview}>
                           <Document
                              file={file.url}
                              onLoadError={(error) =>
                                 console.error('Errore caricamento PDF:', error)
                              }
                           >
                              <Page pageNumber={1} width={300} />
                           </Document>
                        </div>
                     </Link>

                     <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(file)}
                     >
                        Elimina
                     </button>
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
};

export default FileList;
