// src/components/UploadFile/index.tsx

import React, { useState, useRef } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { storage, db } from '../../firebase/firebaseConfig.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';

import styles from './index.module.scss';

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
            path: filePath,
            createdAt: Timestamp.now(),
         });

         setUploadStatus('Upload completato con successo!');
         setTimeout(() => setUploadStatus(''), 5000);

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
      <div className={styles.uploadContainer}>
         <h3 className={styles.title}>Carica un file PDF</h3>

         <div className={styles.uploadRow}>
            {/* Spinner a sinistra dell'input (condizionale) */}
            {isUploading && <div className={styles.spinner} />}

            <input
               type="file"
               accept="application/pdf"
               onChange={handleFileChange}
               ref={fileInputRef}
               className={styles.fileInput}
               disabled={isUploading}
            />
            <button
               onClick={handleUpload}
               disabled={isUploading}
               className={styles.uploadButton}
            >
               Carica
            </button>
         </div>

         {uploadStatus && <p className={styles.uploadStatus}>{uploadStatus}</p>}
      </div>
   );
};

export default UploadFile;
