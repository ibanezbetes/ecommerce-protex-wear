import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import App from './App';
import './index.css';

// ------------------------------------------------------------------
// CONFIGURACIÓN MANUAL OBLIGATORIA (Hardcoded)
// Debe estar aquí para cargarse ANTES que AuthContext
// ------------------------------------------------------------------
Amplify.configure({
  "auth": {
    "user_pool_id": "eu-west-1_oQly2sLvE",
    "aws_region": "eu-west-1",
    "user_pool_client_id": "6r4n23dup3r8coces1p7tidd82",
    "identity_pool_id": "eu-west-1:930a6777-448f-49d3-a450-5217c63c7508",
    "mfa_methods": [],
    "standard_required_attributes": ["email"],
    "username_attributes": ["email"],
    "user_verification_types": ["email"],
    "mfa_configuration": "NONE",
    "password_policy": {
      "min_length": 8,
      "require_lowercase": true,
      "require_numbers": true,
      "require_symbols": true,
      "require_uppercase": true
    },
    "unauthenticated_identities_enabled": true
  },
  "data": {
    "url": "https://dwlvjyyun5bxpj2xlckg6qhlee.appsync-api.eu-west-1.amazonaws.com/graphql",
    "aws_region": "eu-west-1",
    "api_key": "da2-gc5s5p44rrd2fltyqdijtts6ii",
    "default_authorization_type": "AMAZON_COGNITO_USER_POOLS",
    "authorization_types": ["API_KEY", "AWS_IAM"]
  },
  "storage": {
    "aws_region": "eu-west-1",
    "bucket_name": "amplify-dw4alzwzez7pl-dev-protexwearstoragebucket9-k58ao0x9mrzk",
    "buckets": [
      {
        "name": "protexWearStorage",
        "bucket_name": "amplify-dw4alzwzez7pl-dev-protexwearstoragebucket9-k58ao0x9mrzk",
        "aws_region": "eu-west-1",
        "paths": {
          "product-images/*": {
            "guest": ["get", "list"],
            "authenticated": ["get", "list", "write"],
            "groupsADMIN": ["get", "list", "write", "delete"]
          },
          "profile-images/*": {
            "authenticated": ["get", "list", "write"],
            "groupsADMIN": ["get", "list", "write", "delete"]
          },
          "order-documents/*": {
            "authenticated": ["get", "list", "write"],
            "groupsADMIN": ["get", "list", "write", "delete"]
          },
          "company-assets/*": {
            "authenticated": ["get", "list"],
            "groupsADMIN": ["get", "list", "write", "delete"]
          },
          "temp-uploads/*": {
            "authenticated": ["get", "list", "write", "delete"]
          }
        }
      }
    ]
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);