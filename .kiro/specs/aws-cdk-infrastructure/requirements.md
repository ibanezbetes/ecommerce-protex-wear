# Requirements Document

## Introduction

Infraestructura como código para el despliegue de la tienda online Protex Wear usando AWS CDK. El objetivo es crear una solución de bajo coste (~$5-10 USD/mes) basada en AWS Lightsail con WordPress/WooCommerce, optimizada para un distribuidor de ropa laboral y EPIs con catálogo masivo y lógica B2B.

## Glossary

- **CDK_Stack**: El stack de AWS CDK que define toda la infraestructura
- **Lightsail_Instance**: Instancia de AWS Lightsail con imagen Bitnami WordPress
- **Static_IP**: Dirección IP estática asignada a la instancia Lightsail
- **User_Data_Script**: Script de inicialización que configura SWAP y permisos
- **Bitnami_WordPress**: Imagen preconfigurada de WordPress con Nginx y PHP-FPM

## Requirements

### Requirement 1: Infraestructura Base AWS Lightsail

**User Story:** Como arquitecto del sistema, quiero desplegar una instancia Lightsail con WordPress, para que el equipo tenga una base estable y reproducible para el e-commerce.

#### Acceptance Criteria

1. WHEN el CDK stack se despliega, THE CDK_Stack SHALL crear una instancia Lightsail con blueprint 'wordpress'
2. WHEN se selecciona el plan de instancia, THE CDK_Stack SHALL usar bundleId 'nano_3_0' para mantener costes bajo $5 USD/mes
3. WHEN se configura la zona de disponibilidad, THE CDK_Stack SHALL usar 'eu-west-1a' para optimizar latencia en Europa
4. WHEN la instancia se crea, THE CDK_Stack SHALL usar la imagen Bitnami certificada de WordPress

### Requirement 2: Configuración de Red y IP Estática

**User Story:** Como coordinador del proyecto, quiero una IP estática para la instancia, para que pueda configurar Cloudflare DNS de forma permanente.

#### Acceptance Criteria

1. WHEN el stack se despliega, THE CDK_Stack SHALL crear una IP estática usando CfnStaticIp
2. WHEN la IP estática se crea, THE CDK_Stack SHALL asociarla a la instancia Lightsail usando CfnStaticIpAttachment
3. WHEN el despliegue se completa, THE CDK_Stack SHALL mostrar la IP pública como output del stack
4. THE CDK_Stack SHALL garantizar que la IP estática persiste entre redespliegues

### Requirement 3: Configuración de Memoria SWAP

**User Story:** Como desarrollador backend, quiero que la instancia tenga memoria SWAP configurada, para que no se produzcan errores OOM durante la importación masiva de productos.

#### Acceptance Criteria

1. WHEN la instancia se inicializa, THE User_Data_Script SHALL crear un archivo SWAP de 2GB usando fallocate
2. WHEN el archivo SWAP se crea, THE User_Data_Script SHALL configurar permisos 600 y activar el SWAP
3. WHEN el SWAP se activa, THE User_Data_Script SHALL añadir entrada permanente en /etc/fstab
4. THE User_Data_Script SHALL ejecutarse automáticamente durante el primer arranque de la instancia

### Requirement 4: Configuración de Permisos Bitnami

**User Story:** Como desarrollador, quiero que los permisos de WordPress estén correctamente configurados, para que el equipo pueda trabajar sin problemas de acceso a archivos.

#### Acceptance Criteria

1. WHEN el script de inicialización se ejecuta, THE User_Data_Script SHALL establecer propietario bitnami:daemon en wp-content
2. WHEN se configuran permisos, THE User_Data_Script SHALL dar permisos de escritura al grupo en wp-content
3. THE User_Data_Script SHALL aplicar permisos recursivamente a todo el directorio wp-content
4. THE User_Data_Script SHALL seguir las mejores prácticas de seguridad de Bitnami

### Requirement 5: Automatización y Reproducibilidad

**User Story:** Como equipo de desarrollo, queremos poder destruir y recrear la infraestructura fácilmente, para que podamos recuperarnos rápidamente de errores durante el desarrollo.

#### Acceptance Criteria

1. WHEN se ejecuta cdk deploy, THE CDK_Stack SHALL crear toda la infraestructura de forma idempotente
2. WHEN se ejecuta cdk destroy, THE CDK_Stack SHALL limpiar todos los recursos excepto datos persistentes críticos
3. THE CDK_Stack SHALL estar escrito en TypeScript para mantener consistencia con el resto del proyecto
4. THE CDK_Stack SHALL usar aws-cdk-lib con constructs L1 para máximo control

### Requirement 6: Outputs y Integración

**User Story:** Como coordinador del proyecto, quiero recibir la información necesaria después del despliegue, para que pueda continuar con la configuración de DNS y acceso.

#### Acceptance Criteria

1. WHEN el despliegue se completa exitosamente, THE CDK_Stack SHALL mostrar la IP estática como output
2. THE CDK_Stack SHALL proporcionar información clara sobre cómo acceder a la instancia
3. THE CDK_Stack SHALL incluir instrucciones para obtener las credenciales de Bitnami
4. THE CDK_Stack SHALL documentar los siguientes pasos para la configuración de Cloudflare