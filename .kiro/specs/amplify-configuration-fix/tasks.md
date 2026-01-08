# Implementation Plan: Amplify Configuration Fix

## Overview

Plan de implementación para resolver el error crítico "Auth UserPool not configured" mediante refactorización del entry point, configuración de rutas SPA y verificación de build artifacts.

## Tasks

- [x] 1. Crear archivo de configuración dedicado de Amplify
  - Extraer configuración de Amplify de main.tsx
  - Crear src/amplify-setup.ts con configuración hardcoded
  - Asegurar que sea un archivo de "efecto secundario" sin exports
  - _Requirements: 1.1_

- [x] 1.1 Escribir test unitario para amplify-setup.ts
  - Verificar que el archivo existe y contiene configuración válida
  - _Requirements: 1.1_

- [x] 2. Refactorizar main.tsx para orden de importación correcto
  - Mover configuración de Amplify a amplify-setup.ts
  - Añadir import './amplify-setup' como primera línea
  - Limpiar main.tsx dejando solo lógica de renderizado
  - _Requirements: 1.2, 1.3, 1.4_

- [x] 2.1 Escribir test de orden de importación
  - Verificar que main.tsx importa amplify-setup como primera línea
  - Verificar que main.tsx no contiene Amplify.configure
  - _Requirements: 1.2, 1.4_

- [x] 3. Documentar configuración de CloudFront para rutas SPA
  - Crear documentación con regla de reescritura específica
  - Incluir patrón regex para excluir archivos estáticos
  - Proporcionar instrucciones para Amplify Console
  - _Requirements: 2.2_

- [x] 3.1 Escribir test de propiedad para patrón de reescritura
  - **Property 1: Rewrite Rule Pattern Validation**
  - **Validates: Requirements 2.3**

- [x] 4. Checkpoint - Verificar funcionamiento local
  - Ejecutar aplicación localmente para verificar que no hay errores de configuración
  - Confirmar que AuthContext se inicializa correctamente
  - Asegurar que todas las pruebas pasan

- [x] 5. Crear guía de verificación de build artifacts
  - Documentar cómo verificar que amplify-setup.ts está en el bundle
  - Incluir comandos para inspeccionar build output
  - Proporcionar checklist de verificación post-deployment
  - _Requirements: 3.2, 3.4_

- [x] 5.1 Escribir test de verificación de build
  - Verificar que amplify-setup está incluido en el bundle
  - _Requirements: 3.4_

- [x] 6. Final checkpoint - Validación completa
  - Ejecutar todas las pruebas
  - Verificar que la configuración está lista para deployment
  - Confirmar que todos los archivos están en su lugar correcto

## Notes

- Todas las tareas son obligatorias para una implementación completa
- Cada task referencia requirements específicos para trazabilidad
- Los checkpoints aseguran validación incremental
- Property tests validan patrones universales de corrección
- Unit tests validan ejemplos específicos y casos edge