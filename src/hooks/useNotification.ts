// src/hooks/useNotification.ts
import { useEffect, useState } from 'react';

const useNotification = () => {
   const [permission, setPermission] = useState<NotificationPermission>(
      Notification.permission
   );
   const [notificationError, setNotificationError] = useState<string>('');

   useEffect(() => {
      if ('Notification' in window && permission === 'default') {
         Notification.requestPermission().then((perm) => {
            setPermission(perm);
            if (perm === 'denied') {
               setNotificationError(
                  'Le notifiche sono disabilitate. Abilita le notifiche dalle impostazioni del browser.'
               );
            }
         });
      } else if (permission === 'denied') {
         setNotificationError(
            'Le notifiche sono disabilitate. Abilita le notifiche dalle impostazioni del browser.'
         );
      }
   }, [permission]);

   const notify = (title: string, options?: NotificationOptions) => {
      if ('Notification' in window) {
         if (permission === 'granted') {
            new Notification(title, options);
         } else {
            console.warn('Notifiche non abilitate, permission:', permission);
         }
      } else {
         console.error('Il browser non supporta le notifiche');
      }
   };

   return { permission, notify, notificationError };
};

export default useNotification;
