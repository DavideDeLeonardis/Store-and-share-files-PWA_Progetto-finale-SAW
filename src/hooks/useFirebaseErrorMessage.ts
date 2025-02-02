import { FirebaseError } from 'firebase/app';

/*
 * Custom hook per mappare i codici di errore di Firebase a messaggi utente
 */

function mapFirebaseErrorCodeToMessage(code: string): string {
   switch (code) {
      case 'auth/email-already-in-use':
         return 'Email già in uso.';
      case 'auth/weak-password':
         return 'La password deve contenere almeno 6 caratteri.';
      case 'auth/invalid-email':
         return 'Indirizzo email non valido.';
      case 'auth/user-not-found':
         return 'Utente non trovato.';
      case 'auth/wrong-password':
         return 'Password errata.';
      default:
         return 'Si è verificato un errore. Riprova.';
   }
}

const useFirebaseErrorMessage = () => {
   function getErrorMessage(error: unknown) {
      if (error instanceof FirebaseError)
         return mapFirebaseErrorCodeToMessage(error.code);

      return 'Si è verificato un errore inatteso.';
   }

   return { getErrorMessage };
};

export default useFirebaseErrorMessage;
