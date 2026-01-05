import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// 1. Importaciones de Amplify
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

// 2. Configuración explícita (¡Con log de depuración!)
Amplify.configure(outputs);

// DEBUG: Vamos a ver qué está cargando realmente Amplify
console.log('✅ Amplify Configurado con:', outputs.data.model_introspection?.models);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);