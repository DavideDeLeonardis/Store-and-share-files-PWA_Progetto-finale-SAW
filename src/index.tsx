import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerServiceWorker } from './serviceWorkerRegistration';
import App from './App.tsx';

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
   <React.StrictMode>
      <App />
   </React.StrictMode>
);

registerServiceWorker();
