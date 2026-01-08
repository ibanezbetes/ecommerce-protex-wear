import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

// ------------------------------------------------------------------
// CONFIGURACIÓN ORIGINAL DE AMPLIFY QUE FUNCIONABA
// Usando configuración original para Auth y GraphQL
// ------------------------------------------------------------------

console.log('🔧 Iniciando configuración de Amplify...');

// Configuración original completa que funcionaba
const originalConfig = {
  Auth: {
    Cognito: {
      userPoolId: "eu-west-1_oQly2sLvE",
      userPoolClientId: "6r4n23dup3r8coces1p7tidd82",
      identityPoolId: "eu-west-1:930a6777-448f-49d3-a450-5217c63c7508",
      loginWith: {
        email: true,
        username: false,
      },
      signUpVerificationMethod: "code",
      userAttributes: {
        email: {
          required: true,
        },
      },
      allowGuestAccess: true,
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: "https://j6jew2gfcvetlopmlt5yrluc3a.appsync-api.eu-west-1.amazonaws.com/graphql",
      region: "eu-west-1",
      defaultAuthMode: "apiKey",
      apiKey: "da2-h5gc6d2fmfdshbqr2izlw73nnq",
      // Usar la introspección del modelo del nuevo archivo para que client.models funcione
      modelIntrospection: outputs.data.model_introspection
    },
  },
  Storage: {
    S3: {
      bucket: "amplify-dw4alzwzez7pl-dev-protexwearstoragebucket9-k58ao0x9mrzk",
      region: "eu-west-1",
    },
  },
};

try {
  // Configurar Amplify con configuración original + model introspection
  Amplify.configure(originalConfig);
  console.log('✅ Amplify configurado exitosamente con configuración original + model introspection');
  
  // Verificar configuración final
  const currentConfig = Amplify.getConfig();
  console.log('🔍 Verificación - Auth configurado:', !!currentConfig.Auth);
  console.log('🔍 Verificación - API configurado:', !!currentConfig.API);
  console.log('🔍 Verificación - Data configurado:', !!currentConfig.API?.GraphQL);
  
  if (currentConfig.API?.GraphQL) {
    console.log('📊 GraphQL Endpoint:', currentConfig.API.GraphQL.endpoint);
    console.log('🔑 Default Auth Mode:', currentConfig.API.GraphQL.defaultAuthMode);
    console.log('🧬 Model Introspection:', !!currentConfig.API.GraphQL.modelIntrospection);
  }
  
  if (currentConfig.Auth?.Cognito) {
    console.log('👤 User Pool ID:', currentConfig.Auth.Cognito.userPoolId);
  }
  
} catch (error) {
  console.error('❌ Error configurando Amplify:', error);
  
  // Configuración de fallback (mínima original)
  const fallbackConfig = {
    Auth: {
      Cognito: {
        userPoolId: "eu-west-1_oQly2sLvE",
        userPoolClientId: "6r4n23dup3r8coces1p7tidd82",
        identityPoolId: "eu-west-1:930a6777-448f-49d3-a450-5217c63c7508",
        loginWith: {
          email: true,
          username: false,
        },
      },
    },
    API: {
      GraphQL: {
        endpoint: "https://dwlvjyyun5bxpj2xlckg6qhlee.appsync-api.eu-west-1.amazonaws.com/graphql",
        region: "eu-west-1",
        defaultAuthMode: "userPool",
        apiKey: "da2-gc5s5p44rrd2fltyqdijtts6ii"
      },
    },
  };
  
  try {
    Amplify.configure(fallbackConfig);
    console.log('🔄 Configuración de fallback aplicada (original sin model introspection)');
  } catch (fallbackError) {
    console.error('💥 Error crítico en configuración de fallback:', fallbackError);
  }
}