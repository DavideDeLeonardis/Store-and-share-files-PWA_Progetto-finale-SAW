import React from 'react';
import { Link } from 'react-router-dom';

import styles from './index.module.scss';

interface AuthFormProps {
   title: string;
   error: string;
   email: string;
   password: string;
   onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   onSubmit: (e: React.FormEvent) => void;
   buttonLabel: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
   title,
   error,
   email,
   password,
   onEmailChange,
   onPasswordChange,
   onSubmit,
   buttonLabel,
}) => {
   return (
      <div className={styles.formContainer}>
         <h2 className={styles.title}>{title}</h2>

         {error && <p className={styles.errorMessage}>{error}</p>}

         <form onSubmit={onSubmit}>
            <div className={styles.formField}>
               <label>Email</label>
               <input
                  type="email"
                  required
                  value={email}
                  onChange={onEmailChange}
               />
            </div>
            <div className={styles.formField}>
               <label>Password</label>
               <input
                  type="password"
                  required
                  value={password}
                  onChange={onPasswordChange}
               />
            </div>

            <button type="submit" className={styles.submitButton}>
               {buttonLabel}
            </button>
         </form>

         <p className={styles.homeLink}>
            <Link to="/">Torna alla home</Link>
         </p>
      </div>
   );
};

export default AuthForm;
