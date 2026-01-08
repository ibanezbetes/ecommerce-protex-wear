# Requirements Document

## Introduction

Corrección crítica de configuración de Amplify para resolver el error "Auth UserPool not configured" en producción causado por Import Hoisting y problemas de navegación SPA.

## Glossary

- **Amplify**: Framework de AWS para aplicaciones full-stack
- **Import_Hoisting**: Comportamiento de JavaScript que mueve imports al inicio del módulo
- **SPA**: Single Page Application
- **Entry_Point**: Punto de entrada principal de la aplicación (main.tsx)
- **CloudFront**: CDN de AWS utilizado por Amplify Hosting

## Requirements

### Requirement 1: Refactorización del Entry Point

**User Story:** Como desarrollador, quiero que la configuración de Amplify se ejecute antes que cualquier código de la aplicación, para evitar errores de "Auth UserPool not configured".

#### Acceptance Criteria

1. THE System SHALL crear un archivo dedicado src/amplify-setup.ts que contenga únicamente la configuración de Amplify
2. WHEN main.tsx se ejecuta, THE System SHALL importar amplify-setup.ts como primera línea obligatoria
3. THE Amplify_Configuration SHALL ejecutarse completamente antes de que cualquier componente de React se evalúe
4. THE Entry_Point SHALL mantener la separación clara entre configuración y lógica de aplicación

### Requirement 2: Corrección de Rutas SPA

**User Story:** Como usuario, quiero poder navegar directamente a cualquier ruta de la aplicación (como /login) sin recibir errores 404.

#### Acceptance Criteria

1. WHEN un usuario navega directamente a una ruta SPA, THE System SHALL servir index.html en lugar de retornar 404
2. THE CloudFront_Configuration SHALL incluir reglas de reescritura para todas las rutas que no sean archivos estáticos
3. THE Rewrite_Rule SHALL aplicarse a patrones que excluyan extensiones de archivos estáticos (css, js, png, etc.)
4. THE System SHALL mantener el comportamiento correcto para archivos estáticos reales

### Requirement 3: Verificación de Build Artifacts

**User Story:** Como desarrollador, quiero asegurarme de que el proceso de build no sobrescriba las configuraciones manuales de Amplify.

#### Acceptance Criteria

1. THE Build_Process SHALL preservar todos los archivos de configuración manual durante el deployment
2. WHEN el build se ejecuta, THE System SHALL mantener la estructura de archivos de configuración intacta
3. THE Amplify_Console SHALL respetar las configuraciones de reescritura definidas manualmente
4. THE System SHALL validar que amplify-setup.ts se incluya correctamente en el bundle final