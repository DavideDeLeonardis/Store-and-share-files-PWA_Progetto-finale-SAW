import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import styles from './index.module.scss';

interface AuthFormProps {
   title: string;
   error: string;
   username?: string;
   email: string;
   password: string;
   onUsernameChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
   onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
   buttonLabel: string;
}

/**
 * Componente per la gestione del form di autenticazione (login e signup)
 */
const AuthForm: FC<AuthFormProps> = ({
   title,
   error,
   username,
   email,
   password,
   onUsernameChange,
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
            {onUsernameChange && (
               <div className={styles.formField}>
                  <label>Nome utente</label>
                  <input
                     type="text"
                     required
                     value={username}
                     onChange={onUsernameChange}
                     pattern=".*\S.*"
                     title="Il nome utente non può essere vuoto o contenere solo spazi."
                  />
               </div>
            )}

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

         {title.toLowerCase() === 'login' ? (
            <p className={styles.altAuthLink}>
               Non sei registrato? <Link to="/signup">Registrati</Link>
            </p>
         ) : title.toLowerCase().includes('registrazione') ||
           title.toLowerCase() === 'signup' ? (
            <p className={styles.altAuthLink}>
               Hai già un account? <Link to="/login">Accedi</Link>
            </p>
         ) : null}

         <p className={styles.homeLink}>
            <Link to="/">Torna alla home</Link>
         </p>
      </div>
   );
};

export default AuthForm;
