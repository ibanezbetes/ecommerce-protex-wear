import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// import { Amplify } from 'aws-amplify'; <-- Ya no hace falta aquí
// import App from './App';
// ... resto de imports

import App from './App';
import './index.css';

// NOTA: La configuración de Amplify ahora reside en src/lib/amplify.ts
// que se carga cuando App importa AuthContext.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);