import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Mueve la configuración lo más arriba posible
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

// Configura ANTES de importar cualquier componente que use la API
Amplify.configure(outputs);

// Si 'amplify-setup' solo tiene estilos o polyfills, déjalo aquí. 
// Si tenía 'Amplify.configure' dentro, BORRA esa línea dentro de ese archivo.
import './amplify-setup'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);