import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig.ts';
import { useAuth } from '../contexts/AuthContext.tsx';

interface FileData {
   docId: string; // anziché "id"
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
            const data = doc.data() as Omit<FileData, 'docId'>; // escludi docId
            fileList.push({ docId: doc.id, ...data });
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
            <ul>
               {files.map((file) => (
                  <li key={file.docId}>
                     <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                        {file.name}
                     </a>
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
};

export default FileList;
