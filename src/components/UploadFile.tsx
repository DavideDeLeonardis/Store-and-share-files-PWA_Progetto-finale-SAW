// src/components/UploadFile.tsx
import React, { useState, useRef } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { storage, db } from '../firebase/firebaseConfig.ts';
import { useAuth } from '../contexts/AuthContext.tsx';

const UploadFile: React.FC = () => {
   const { user } = useAuth();
   const [file, setFile] = useState<File | null>(null);
   const [uploadStatus, setUploadStatus] = useState<string>('');
   const [isUploading, setIsUploading] = useState<boolean>(false);

   const fileInputRef = useRef<HTMLInputElement | null>(null);

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
         setFile(e.target.files[0]);
      }
   };

   const handleUpload = async () => {
      if (!file) {
         setUploadStatus('Nessun file selezionato');
         return;
      }
      if (!user) {
         setUploadStatus('Devi essere loggato per caricare un file');
         return;
      }

      setIsUploading(true);
      setUploadStatus('Caricamento in corso...');

      try {
         const filePath = `files/${user.uid}/${file.name}`;
         const fileRef = ref(storage, filePath);

         await uploadBytes(fileRef, file);

         const url = await getDownloadURL(fileRef);

         await addDoc(collection(db, 'files'), {
            name: file.name,
            url: url,
            userId: user.uid,
            createdAt: Timestamp.now(),
         });

         setUploadStatus('Upload completato con successo!');
         setFile(null);

         if (fileInputRef.current) {
            fileInputRef.current.value = '';
         }
      } catch (e) {
         console.error('[handleUpload] Errore nell’upload:', e);
         setUploadStatus('Errore durante il caricamento del file');
      } finally {
         setIsUploading(false);
      }
   };

   return (
      <div>
         <h3>Carica un file PDF</h3>
         <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            ref={fileInputRef}
         />
         <button onClick={handleUpload} disabled={isUploading}>
            Carica
         </button>

         {uploadStatus && <p>{uploadStatus}</p>}

         {/* SPINNER */}
         {isUploading && (
            <div style={{ margin: '1rem 0' }}>
               <div className="spinner" />
            </div>
         )}
      </div>
   );
};

export default UploadFile;
