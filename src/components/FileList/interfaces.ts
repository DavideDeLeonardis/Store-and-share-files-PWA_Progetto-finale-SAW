export interface FileData {
   docId: string; // ID del documento in Firestore
   name: string;
   url: string; // URL del file nello storage
   userId: string;
   path?: string; // Percorso del file nello storage
   createdAt?: any; // Timestamp Firestore
}

export interface FileElementProps {
   file: FileData;
   onDelete: (file: FileData) => void;
}
