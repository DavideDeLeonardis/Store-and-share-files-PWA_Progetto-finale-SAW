import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
   return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
         <h1>Benvenuto!</h1>
         <p>Scegli un'opzione per iniziare:</p>
         <div
            style={{
               display: 'flex',
               justifyContent: 'center',
               gap: '10px',
               marginTop: '1rem',
            }}
         >
            <Link to="/login">Login</Link>
            <Link to="/signup">Registrati</Link>
         </div>
      </div>
   );
};

export default LandingPage;
