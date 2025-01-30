import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { storage, db } from '../firebase/firebaseConfig.ts';
import { useAuth } from '../contexts/AuthContext.tsx';

const UploadFile: React.FC = () => {
   const { user } = useAuth(); // utente attualmente loggato
   const [file, setFile] = useState<File | null>(null);
   const [uploadStatus, setUploadStatus] = useState<string>('');

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
         console.log(
            '[handleFileChange] File selezionato:',
            e.target.files[0].name
         );
         setFile(e.target.files[0]);
      }
   };

   const handleUpload = async () => {
      console.log('[handleUpload] Inizio procedura upload...');
      if (!file) {
         setUploadStatus('Nessun file selezionato');
         console.log('[handleUpload] Errore: nessun file selezionato');
         return;
      }
      if (!user) {
         setUploadStatus('Devi essere loggato per caricare un file');
         console.log('[handleUpload] Errore: utente non loggato');
         return;
      }

      try {
         // 1. Crea un riferimento in Firebase Storage
         const filePath = `files/${user.uid}/${file.name}`;
         console.log(`[handleUpload] Percorso storage: ${filePath}`);
         const fileRef = ref(storage, filePath);

         // 2. Carica il file su Firebase Storage
         console.log('[handleUpload] Caricamento in corso su Storage...');
         await uploadBytes(fileRef, file);
         console.log('[handleUpload] Caricamento completato con successo!');

         // 3. Ottieni l’URL di download
         console.log('[handleUpload] Ottenimento download URL...');
         const url = await getDownloadURL(fileRef);
         console.log('[handleUpload] Download URL ottenuto:', url);

         // 4. Salva i metadati in Firestore
         console.log('[handleUpload] Salvataggio metadati in Firestore...');
         const docRef = await addDoc(collection(db, 'files'), {
            name: file.name,
            url: url,
            userId: user.uid,
            createdAt: Timestamp.now(),
         });
         console.log(
            '[handleUpload] Metadati salvati con ID documento:',
            docRef.id
         );

         // 5. Reset stati o mostra messaggio
         setUploadStatus('Upload completato con successo!');
         setFile(null);
      } catch (error) {
         console.error('[handleUpload] Errore nell’upload:', error);
         setUploadStatus('Errore durante il caricamento del file');
      }
   };

   return (
      <div>
         <h3>Carica un file PDF</h3>
         <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
         />
         <button onClick={handleUpload}>Carica</button>
         {uploadStatus && <p>{uploadStatus}</p>}
      </div>
   );
};

export default UploadFile;
