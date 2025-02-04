import React from 'react';
import ReactDOM from 'react-dom/client';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import App from './App.tsx';
import { registerServiceWorker } from './serviceWorkerRegistration';

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
   <React.StrictMode>
      <App />
   </React.StrictMode>
);

registerServiceWorker();
