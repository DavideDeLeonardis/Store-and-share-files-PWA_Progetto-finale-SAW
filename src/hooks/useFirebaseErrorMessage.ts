import { FirebaseError } from 'firebase/app';

/**
 * Custom hook per mappare i codici di errore di Firebase a messaggi utente.
 * @returns getErrorMessage: funzione per ottenere il messaggio di errore da mostrare all'utente
 */

const errorMessages: Record<string, string> = {
   'auth/weak-password': 'La password deve contenere almeno 6 caratteri.',
   'auth/invalid-email': 'Indirizzo email non valido.',
   'auth/invalid-credential': 'Credenziali non trovate.',
   'auth/email-already-in-use': 'Email già in uso.',
   'auth/user-not-found': 'Utente non trovato.',
   'auth/wrong-password': 'Password errata.',
   'auth/popup-closed-by-user':
      'Hai chiuso il popup di autenticazione prima di selezionare un account.',
};

const mapFirebaseErrorCodeToMessage = (code: string): string => {
   return errorMessages[code] || 'Si è verificato un errore. Riprova.';
};

const useFirebaseErrorMessage = () => {
   const getErrorMessage = (error: unknown): string => {
      if (error instanceof FirebaseError)
         return mapFirebaseErrorCodeToMessage(error.code);

      return 'Si è verificato un errore inatteso.';
   };

   return { getErrorMessage };
};

export default useFirebaseErrorMessage;
