import { useCallback, useEffect, useState } from 'react';

/**
 * Custom hook per gestire le notifiche del browser (se supportate).
 * @returns permission: stato della permission delle notifiche ('granted', 'denied' o 'default').
 * @returns notify: funzione per inviare una notifica.
 * @returns notificationError: eventuale errore da mostrare all'utente.
 */

const useNotification = () => {
   // Verifica se il browser supporta le Notification
   const isSupported =
      typeof window !== 'undefined' && 'Notification' in window;

   const [permission, setPermission] = useState<NotificationPermission>(
      isSupported ? Notification.permission : 'denied'
   );
   const [notificationError, setNotificationError] = useState<string>('');

   useEffect(() => {
      if (!isSupported) return;

      // Se lo stato della permission è "default", viene richiesta la permission
      if (permission === 'default')
         Notification.requestPermission().then((perm) => {
            setPermission(perm);
            if (perm === 'denied')
               setNotificationError('Le notifiche sono disabilitate.');
         });
      else if (permission === 'denied')
         // Se la permission è già stata negata, mostriamo un messaggio più esplicativo
         setNotificationError(
            'Le notifiche sono disabilitate. Abilita le notifiche dalle impostazioni del browser.'
         );
   }, [isSupported, permission]);

   // Funzione per inviare una notifica, evitando di creare una nuova funzione ad ogni render in cui viene chiamato notify
   const notify = useCallback(
      (title: string, options?: NotificationOptions) => {
         if (!isSupported) {
            console.error('Il browser non supporta le notifiche');
            return;
         }

         if (permission !== 'granted') {
            console.warn('Notifiche non abilitate, permission:', permission);
            return;
         }

         new Notification(title, options);
      },
      [isSupported, permission]
   );

   return { permission, notify, notificationError };
};

export default useNotification;
