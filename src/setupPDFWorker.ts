// src/setupPDFWorker.ts
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc =
   'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
