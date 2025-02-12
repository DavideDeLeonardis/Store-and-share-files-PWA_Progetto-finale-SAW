import React from 'react';
import styles from './index.module.scss';

interface SpinnerProps {
   className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className = '' }) => {
   return <div className={`${styles.spinner} ${className}`} />;
};

export default Spinner;
