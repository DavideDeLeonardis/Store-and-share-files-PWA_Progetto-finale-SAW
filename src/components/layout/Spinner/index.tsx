import React from 'react';
import styles from './index.module.scss';

interface SpinnerProps {
   display?: 'block' /* default */ | 'inline-block';
   className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
   display = 'block',
   className = '',
}) => {
   return (
      <div className={`${styles.spinner} ${className}`} style={{ display }} />
   );
};

export default Spinner;
