'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';

import { FileElementProps } from '../interfaces.ts';
import Button from '../../layout/Button/index.tsx';

import styles from './index.module.scss';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const FileElement: React.FC<FileElementProps> = ({ file, onDelete }) => {
   const [errorPreview, setErrorPreview] = useState<boolean>(false);

   return (
      <li className={styles.fileItem}>
         <div className={styles.fileContent}>
            <strong className={styles.fileName}>{file.name}</strong>

            {/* Anteprima del PDF */}
            <div className={styles.pdfPreview}>
               {errorPreview ? (
                  <p className={styles.errorMessage}>
                     Anteprima non disponibile, il file non è un PDF
                  </p>
               ) : (
                  <Document
                     file={file.url}
                     onLoadError={() => setErrorPreview(true)}
                  >
                     <Page pageNumber={1} width={300} />
                  </Document>
               )}
            </div>

            {/* Buttons view e delete file */}
            <div className={styles.buttonGroup}>
               <Link to={file.url} target="_blank" rel="noreferrer">
                  <Button className={styles.viewButton}>Visualizza</Button>
               </Link>

               <Button
                  className={styles.deleteButton}
                  onClick={() => onDelete(file)}
                  variant="danger"
               >
                  Elimina
               </Button>
            </div>
         </div>
      </li>
   );
};

export default FileElement;
