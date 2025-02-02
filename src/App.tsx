import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext.tsx';
import PrivateRoute from './components/PrivateRoute/index.tsx';

import LandingPage from './components/pages/LandingPage/index.tsx';
import Login from './components/pages/Login/index.tsx';
import Signup from './components/pages/Signup/index.tsx';
import Dashboard from './components/pages/Dashboard/index.tsx';
import Profile from './components/pages/Profile/index.tsx';

import './assets/scss/index.scss';

function App() {
   return (
      <AuthProvider>
         <BrowserRouter>
            <Routes>
               <Route path="/" element={<LandingPage />} />
               <Route path="/login" element={<Login />} />
               <Route path="/signup" element={<Signup />} />
               <Route
                  path="/dashboard"
                  element={
                     <PrivateRoute>
                        <Dashboard />
                     </PrivateRoute>
                  }
               />
               <Route
                  path="/profile"
                  element={
                     <PrivateRoute>
                        <Profile />
                     </PrivateRoute>
                  }
               />
               <Route path="*" element={<Navigate to="/" />} />
            </Routes>
         </BrowserRouter>
      </AuthProvider>
   );
}

export default App;
