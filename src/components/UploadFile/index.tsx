import React, { useState, useRef } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

import { storage, db } from '../../firebase/firebaseConfig.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';
import Button from '../layout/Button/index.tsx';
import useNotification from '../../hooks/useNotification.ts';

import styles from './index.module.scss';

/**
 * Componente che consente all'utente autenticato di caricare un file PDF. Il file viene salvato su Firebase Storage
 * e le informazioni relative (nome, url, userId, path, data di creazione) vengono registrate in Firestore.
 */
const UploadFile: React.FC = () => {
   const { user } = useAuth();
   const { permission, notify, notificationError } = useNotification();

   const [file, setFile] = useState<File | null>(null);
   const [uploadStatus, setUploadStatus] = useState<string>('');
   const [isUploading, setIsUploading] = useState<boolean>(false);

   // Riferimenti agli elementi HTML input file e button "Carica"
   const fileInputRef = useRef<HTMLInputElement | null>(null);
   const uploadButtonRef = useRef<HTMLButtonElement | null>(null);

   // Salva il file selezionato e sposta il focus sul pulsante "Carica"
   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      if (e.target.files && e.target.files.length > 0) {
         setFile(e.target.files[0]);
         // Sposta il focus
         setTimeout(() => uploadButtonRef.current?.focus(), 100);
      }
   };

   // Carica il file selezionato su Firebase Storage e salva le informazioni del file in Firestore.
   const handleUpload = async (): Promise<void> => {
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
         // Path del file all'interno dello storage: "files/{userId}/{file.name}"
         const filePath: string = `files/${user.uid}/${file.name}`;
         const fileRef = ref(storage, filePath);

         // Upload del file su Firebase Storage, retrieve URL di download del file
         // caricato e salviamo le informazioni del file in Firestore
         await uploadBytes(fileRef, file);
         const url: string = await getDownloadURL(fileRef);
         await addDoc(collection(db, 'files'), {
            name: file.name,
            url,
            userId: user.uid,
            path: filePath,
            type: file.type,
            createdAt: Timestamp.now(),
         });

         setUploadStatus('Upload completato con successo!');

         // Notifica l'utente se il permesso è stato concesso
         if (permission === 'granted')
            notify('Upload completato', {
               body: `Il file "${file.name}" è stato caricato con successo.`,
               icon: '/icon-192.png',
            });

         // Reset
         setTimeout(() => setUploadStatus(''), 5000);
         setFile(null);
         if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (error) {
         console.error('[handleUpload] Errore nell’upload:', error);
         setUploadStatus('Errore durante il caricamento del file');
      } finally {
         setIsUploading(false);
      }
   };

   return (
      <div className={styles.uploadContainer}>
         <h3 className={styles.title}>Carica un file</h3>

         <div className={styles.uploadRow}>
            {/* Spinner */}
            {isUploading && <div className={styles.spinner} />}

            <input
               type="file"
               // ! ACCETTATi TUTTI I FILE, anche file .exe, ...
               onChange={handleFileChange}
               ref={fileInputRef}
               className={styles.fileInput}
               disabled={isUploading}
            />

            <Button
               className={styles.uploadButton}
               onClick={handleUpload}
               disabled={isUploading}
               ref={uploadButtonRef} // forwardRef per spostare il focus
            >
               Carica
            </Button>
         </div>

         {/* Messaggio di stato dell'upload*/}
         {uploadStatus && <p className={styles.uploadStatus}>{uploadStatus}</p>}

         {/* Eventuali errori legati alle notifiche */}
         {notificationError && (
            <div className={styles.notificationError}>{notificationError}</div>
         )}
      </div>
   );
};

export default UploadFile;
