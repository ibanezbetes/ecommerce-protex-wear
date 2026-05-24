import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

console.log('🔧 Iniciando configuración de Amplify...');

try {
  // Configurar Amplify directamente con amplify_outputs.json
  // El nuevo archivo ya tiene defaultAuthMode: AMAZON_COGNITO_USER_POOLS
  Amplify.configure(outputs);
  console.log('✅ Amplify configurado exitosamente con amplify_outputs.json');

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
}
