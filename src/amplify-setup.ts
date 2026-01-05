import { Amplify } from 'aws-amplify';

// ------------------------------------------------------------------
// CONFIGURACIÓN MANUAL CORREGIDA (FORMATO V6 NATIVO)
// Convertimos de snake_case a CamelCase para asegurar compatibilidad
// ------------------------------------------------------------------

console.log('🔧 Iniciando configuración de Amplify...');

try {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: "eu-west-1_oQly2sLvE",
        userPoolClientId: "6r4n23dup3r8coces1p7tidd82",
        identityPoolId: "eu-west-1:930a6777-448f-49d3-a450-5217c63c7508",
        loginWith: {
          email: true,
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
          requireNumbers: true,
          requireSpecialCharacters: true,
          requireUppercase: true,
        },
      },
    },
    API: {
      GraphQL: {
        endpoint: "https://dwlvjyyun5bxpj2xlckg6qhlee.appsync-api.eu-west-1.amazonaws.com/graphql",
        region: "eu-west-1",
        defaultAuthMode: "userPool", // Mapeado de AMAZON_COGNITO_USER_POOLS
        apiKey: "da2-gc5s5p44rrd2fltyqdijtts6ii",
      }
    },
    Storage: {
      S3: {
        bucket: "amplify-dw4alzwzez7pl-dev-protexwearstoragebucket9-k58ao0x9mrzk",
        region: "eu-west-1",
      }
    }
  });

  console.log('✅ Amplify configurado exitosamente');

  // Verificar configuración
  const currentConfig = Amplify.getConfig();
  console.log('🔍 Estado actual de la configuración:', JSON.stringify(currentConfig, null, 2));

  // Verificación robusta
  if (currentConfig.Auth?.Cognito?.userPoolId) {
    console.log('✅ Verificación de Auth exitosa: UserPool detectado');
  } else {
    console.error('❌ Error: Auth sigue vacío. Revisa las credenciales.');
  }

} catch (error) {
  console.error('❌ Error crítico configurando Amplify:', error);
}