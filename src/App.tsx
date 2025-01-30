// src/App.tsx
import React from 'react';
import {
   BrowserRouter as Router,
   Routes,
   Route,
   Navigate,
} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.tsx';
import LandingPage from './components/LandingPage.tsx';
import Login from './components/Login.tsx';
import Signup from './components/Signup.tsx';
import Logout from './components/Logout.tsx';
import Dashboard from './components/Dashboard.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';

function App() {
   return (
      <AuthProvider>
         <Router>
            <Routes>
               {/* Rotta principale: Landing Page */}
               <Route path="/" element={<LandingPage />} />

               {/* Rotta di Login */}
               <Route path="/login" element={<Login />} />

               {/* Rotta di Registrazione */}
               <Route path="/signup" element={<Signup />} />

               {/* Rotta protetta: Dashboard */}
               <Route
                  path="/dashboard"
                  element={
                     <PrivateRoute>
                        <Dashboard />
                     </PrivateRoute>
                  }
               />

               {/* Rotta protetta: Logout */}
               <Route
                  path="/logout"
                  element={
                     <PrivateRoute>
                        <Logout />
                     </PrivateRoute>
                  }
               />

               {/* Se l'utente digita un percorso inesistente, reindirizza alla LandingPage */}
               <Route path="*" element={<Navigate to="/" />} />
            </Routes>
         </Router>
      </AuthProvider>
   );
}

export default App;
