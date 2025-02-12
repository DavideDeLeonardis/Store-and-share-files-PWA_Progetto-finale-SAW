import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { AuthFormProps } from './interfaces.ts';
import Button from '../layout/Button/index.tsx';
import Spinner from '../layout/Spinner/index.tsx';

import styles from './index.module.scss';

/**
 * Componente per la gestione del form di autenticazione (login e signup)
 */
const AuthForm: FC<AuthFormProps> = ({
   title,
   username,
   email,
   password,
   onUsernameChange,
   onEmailChange,
   onPasswordChange,
   onSubmit,
   buttonLabel,
   isLoading,
   error,
}) => {
   return (
      <div className={styles.formContainer}>
         <h2 className={styles.title}>{title}</h2>

         {error && <p className={styles.errorMessage}>{error}</p>}

         <form onSubmit={onSubmit}>
            {/* Nome utente, se in form signup */}
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

            {/* Email */}
            <div className={styles.formField}>
               <label>Email</label>
               <input
                  type="email"
                  required
                  value={email}
                  onChange={onEmailChange}
               />
            </div>

            {/* Password */}
            <div className={styles.formField}>
               <label>Password</label>
               <input
                  type="password"
                  required
                  value={password}
                  onChange={onPasswordChange}
               />
            </div>

            {/* Submit form */}
            <Button
               type="submit"
               className={styles.submitButton}
               disabled={isLoading}
            >
               {buttonLabel}
            </Button>
         </form>

         {isLoading && <Spinner />}

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
