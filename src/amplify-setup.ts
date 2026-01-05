import { Amplify } from 'aws-amplify';

// ------------------------------------------------------------------
// CONFIGURACIÓN DINÁMICA DE AMPLIFY
// Usa amplify_outputs.json generado durante el build
// ------------------------------------------------------------------

console.log('🔧 Iniciando configuración de Amplify...');

// Configuración de fallback (manual)
const fallbackConfig = {
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
    // Agregamos model_introspection básico para evitar errores
    model_introspection: {
      version: 1,
      models: {
        Product: {
          name: "Product",
          fields: {},
          syncable: true,
          pluralName: "Products",
          attributes: [],
          primaryKeyInfo: {
            isCustomPrimaryKey: false,
            primaryKeyFieldName: "id",
            sortKeyFieldNames: []
          }
        }
      },
      enums: {},
      nonModels: {}
    }
  },
  storage: {
    aws_region: "eu-west-1",
    bucket_name: "amplify-dw4alzwzez7pl-dev-protexwearstoragebucket9-k58ao0x9mrzk",
  }
};

try {
  // Intentar cargar amplify_outputs.json dinámicamente
  const loadAmplifyConfig = async () => {
    try {
      console.log('📄 Intentando cargar /amplify_outputs.json...');
      const response = await fetch('/amplify_outputs.json');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const config = await response.json();
      console.log('✅ amplify_outputs.json cargado exitosamente');
      return config;
    } catch (error) {
      console.warn('⚠️ No se pudo cargar amplify_outputs.json, usando configuración de fallback:', error);
      return fallbackConfig;
    }
  };

  // Configurar Amplify con el archivo cargado
  const configureAmplify = async () => {
    const amplifyConfig = await loadAmplifyConfig();
    
    console.log('🔍 Configuración que se va a usar:', {
      hasAuth: !!amplifyConfig.auth,
      hasData: !!amplifyConfig.data,
      hasModelIntrospection: !!amplifyConfig.data?.model_introspection,
      modelsCount: Object.keys(amplifyConfig.data?.model_introspection?.models || {}).length
    });
    
    // Verificar que tenemos model_introspection
    if (amplifyConfig.data?.model_introspection) {
      console.log('✅ model_introspection encontrado en la configuración');
      console.log('📊 Modelos disponibles:', Object.keys(amplifyConfig.data.model_introspection.models));
    } else {
      console.error('❌ model_introspection NO encontrado en la configuración');
    }
    
    Amplify.configure(amplifyConfig);
    console.log('✅ Amplify configurado exitosamente');
    
    // Verificar configuración final
    const currentConfig = Amplify.getConfig();
    console.log('🔍 Verificación final - Auth configurado:', !!currentConfig.Auth);
    console.log('🔍 Verificación final - API configurado:', !!currentConfig.API);
  };

  // Ejecutar configuración
  configureAmplify().catch(error => {
    console.error('❌ Error crítico configurando Amplify:', error);
    // Como último recurso, configurar con fallback
    console.log('🔄 Intentando configuración de emergencia...');
    Amplify.configure(fallbackConfig);
  });

} catch (error) {
  console.error('❌ Error crítico en setup de Amplify:', error);
  // Configuración de emergencia
  console.log('🚨 Usando configuración de emergencia');
  Amplify.configure(fallbackConfig);
}