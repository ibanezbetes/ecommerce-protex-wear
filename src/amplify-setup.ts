import { Amplify } from 'aws-amplify';

// ------------------------------------------------------------------
// CONFIGURACIÓN DINÁMICA DE AMPLIFY
// Usa amplify_outputs.json generado durante el build
// ------------------------------------------------------------------

console.log('🔧 Iniciando configuración de Amplify...');

try {
  // Intentar cargar amplify_outputs.json dinámicamente
  const loadAmplifyConfig = async () => {
    try {
      // En producción, el archivo debe estar en la raíz del build
      const response = await fetch('/amplify_outputs.json');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const config = await response.json();
      console.log('📄 amplify_outputs.json cargado exitosamente');
      return config;
    } catch (error) {
      console.error('❌ Error cargando amplify_outputs.json:', error);
      // Fallback a configuración manual si falla
      return {
        auth: {
          user_pool_id: "eu-west-1_oQly2sLvE",
          aws_region: "eu-west-1",
          user_pool_client_id: "6r4n23dup3r8coces1p7tidd82",
          identity_pool_id: "eu-west-1:930a6777-448f-49d3-a450-5217c63c7508",
          username_attributes: ["email"],
          user_verification_types: ["email"],
          mfa_configuration: "NONE",
          password_policy: {
            min_length: 8,
            require_lowercase: true,
            require_numbers: true,
            require_symbols: true,
            require_uppercase: true,
          },
          unauthenticated_identities_enabled: true,
        },
        data: {
          url: "https://dwlvjyyun5bxpj2xlckg6qhlee.appsync-api.eu-west-1.amazonaws.com/graphql",
          aws_region: "eu-west-1",
          api_key: "da2-gc5s5p44rrd2fltyqdijtts6ii",
          default_authorization_type: "AMAZON_COGNITO_USER_POOLS",
          authorization_types: ["API_KEY", "AWS_IAM"],
        },
        storage: {
          aws_region: "eu-west-1",
          bucket_name: "amplify-dw4alzwzez7pl-dev-protexwearstoragebucket9-k58ao0x9mrzk",
        }
      };
    }
  };

  // Configurar Amplify con el archivo cargado
  const configureAmplify = async () => {
    const amplifyConfig = await loadAmplifyConfig();
    
    console.log('🔍 Configuración cargada:', JSON.stringify(amplifyConfig, null, 2));
    
    // Verificar que tenemos model_introspection
    if (amplifyConfig.data?.model_introspection) {
      console.log('✅ model_introspection encontrado en la configuración');
    } else {
      console.warn('⚠️ model_introspection NO encontrado en la configuración');
    }
    
    Amplify.configure(amplifyConfig);
    console.log('✅ Amplify configurado exitosamente');
    
    // Verificar configuración final
    const currentConfig = Amplify.getConfig();
    console.log('🔍 Estado final de la configuración:', JSON.stringify(currentConfig, null, 2));
  };

  // Ejecutar configuración
  configureAmplify().catch(error => {
    console.error('❌ Error crítico configurando Amplify:', error);
  });

} catch (error) {
  console.error('❌ Error crítico en setup de Amplify:', error);
}