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
import Logout from './components/Logout.tsx';
import Signup from './components/Signup.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';
import Dashboard from './components/Dashboard.tsx';
import "./index.css"

function App() {
   return (
      <AuthProvider>
         <Router>
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
                  path="/logout"
                  element={
                     <PrivateRoute>
                        <Logout />
                     </PrivateRoute>
                  }
               />
               <Route path="*" element={<Navigate to="/" />} />
            </Routes>
         </Router>
      </AuthProvider>
   );
}

export default App;
