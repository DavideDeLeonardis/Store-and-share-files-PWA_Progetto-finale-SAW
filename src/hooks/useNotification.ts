import { useCallback, useEffect, useState } from 'react';

/**
 * Custom hook per gestire le notifiche del browser (se supportate).
 * @returns permission: stato della permission delle notifiche ('granted', 'denied' o 'default').
 * @returns notify: funzione per inviare una notifica.
 * @returns notificationError: eventuale errore da mostrare all'utente.
 */

const useNotification = () => {
   // Verifica se il browser supporta le Notification
   const isSupported = 'serviceWorker' in navigator && 'Notification' in window;

   const [permission, setPermission] = useState<NotificationPermission>(
      isSupported ? Notification.permission : 'denied'
   );
   const [notificationError, setNotificationError] = useState<string>('');

   useEffect(() => {
      if (!isSupported) {
         console.warn('Notifiche non supportate su questo browser.');
         return;
      }

      // Se lo stato della permission è "default", viene richiesta la permission
      if (permission === 'default')
         Notification.requestPermission().then((perm) => {
            setPermission(perm);
            if (perm === 'denied') {
               setNotificationError('Le notifiche sono disabilitate.');
            }
         });
      else if (permission === 'denied') {
         // Se la permission è già stata negata, mostriamo un messaggio più esplicativo
         console.warn('Notifiche già negate in precedenza.');
         setNotificationError(
            'Le notifiche sono disabilitate nelle impostazioni del browser.'
         );
      }
   }, [isSupported, permission]);

   // Funzione per inviare una notifica, evitando di creare una nuova funzione ad ogni render in cui viene chiamato notify
   const notify = useCallback(
      async (title: string, options?: NotificationOptions) => {
         if (!isSupported) {
            console.error('Il browser non supporta le notifiche');
            return;
         }

         if (permission !== 'granted') {
            console.warn('Notifiche non abilitate, permission:', permission);
            setNotificationError('Le notifiche non sono abilitate.');
            return;
         }

         // Usa il Service Worker per inviare le notifiche
         const registration = await navigator.serviceWorker.ready;
         registration.showNotification(title, options);
      },
      [isSupported, permission]
   );

   return { permission, notify, notificationError };
};

export default useNotification;
