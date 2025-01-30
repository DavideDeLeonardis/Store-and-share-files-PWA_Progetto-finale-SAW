import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig.ts';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Link } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface FileData {
   docId: string;
   name: string;
   url: string;
   userId: string;
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
         snapshot.forEach((doc) => {
            fileList.push({
               docId: doc.id,
               ...(doc.data() as Omit<FileData, 'docId'>),
            });
         });
         setFiles(fileList);
      });

      return () => unsubscribe();
   }, [user]);

   if (!user) {
      return <p>Devi effettuare il login per vedere i tuoi file.</p>;
   }

   return (
      <div>
         <h3>I miei PDF caricati</h3>
         {files.length === 0 ? (
            <p>Nessun file caricato</p>
         ) : (
            <ul
               style={{
                  overflowX: 'auto',
                  display: 'flex',
                  justifyContent: 'left',
                  gap: '20px',
               }}
            >
               {files.map((file) => (
                  <li key={file.docId} style={{ marginBottom: '2rem' }}>
                     <Link to={file.url} target="_blank" rel="noreferrer">
                        <strong>{file.name}</strong>
                     </Link>

                     <div
                        style={{
                           width: '300px',
                           maxHeight: '40vh',
                           overflowY: 'auto',
                           border: '1px solid #ccc',
                        }}
                     >
                        <Document
                           file={file.url}
                           onLoadError={(error) =>
                              console.error('Errore caricamento PDF:', error)
                           }
                        >
                           <Page pageNumber={1} width={300} />
                        </Document>
                     </div>
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
};

export default FileList;
