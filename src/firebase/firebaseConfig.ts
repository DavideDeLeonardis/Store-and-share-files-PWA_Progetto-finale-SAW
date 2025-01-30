import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
   apiKey: 'AIzaSyBRI2Viz5uMdI_B_7LK2QeiIyAWXBKSubw',
   authDomain: 'store-and-share-files-pwa.firebaseapp.com',
   projectId: 'store-and-share-files-pwa',
   storageBucket: 'store-and-share-files-pwa.firebasestorage.app',
   messagingSenderId: '41746836014',
   appId: '1:41746836014:web:4f553b7849f31f35edcdbf',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
