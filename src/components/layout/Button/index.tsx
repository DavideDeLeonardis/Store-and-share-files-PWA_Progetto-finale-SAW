import React, {forwardRef} from 'react';
import styles from './index.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   children: React.ReactNode;
   onClick?: () => void;
   type?: 'button' | 'submit' | 'reset';
   variant?: 'primary' | 'danger';
   disabled?: boolean;
   className?: string;
   ref: React.RefObject<HTMLButtonElement>;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>({
   children,
   onClick,
   type = 'button',
   variant = 'primary',
   disabled = false,
   className = '',
   ref
}) => {
   return (
      <button
         type={type}
         onClick={onClick}
         disabled={disabled}
         // Varianti: primary color, danger color
         className={`${styles.button} ${styles[variant]} ${className}`}
         ref={ref}
      >
         {children}
      </button>
   );
};

export default Button;
