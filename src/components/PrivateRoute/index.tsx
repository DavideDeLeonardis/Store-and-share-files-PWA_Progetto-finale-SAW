import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext.tsx';

/**
 * Route che permette di accedere solo se l'utente è loggato
 */
const PrivateRoute = ({ children }) => {
   const { user } = useAuth();

   if (!user) return <Navigate to="/" replace />;

   return <>{children}</>;
};

export default PrivateRoute;
