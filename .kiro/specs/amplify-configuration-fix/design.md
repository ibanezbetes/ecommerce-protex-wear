# Design Document

## Overview

Esta solución aborda el problema crítico de "Auth UserPool not configured" causado por Import Hoisting en JavaScript. El problema ocurre cuando los componentes de React se evalúan antes de que Amplify.configure() se ejecute, creando una condición de carrera.

La solución implementa tres correcciones arquitectónicas:
1. Refactorización del entry point para garantizar orden de ejecución
2. Configuración de rutas SPA en CloudFront/Amplify
3. Verificación de integridad de build artifacts

## Architecture

### Current State Analysis
- `main.tsx` contiene tanto la configuración de Amplify como la inicialización de React
- Import hoisting puede causar que `App.tsx` y sus dependencias se evalúen antes de `Amplify.configure()`
- Navegación directa a rutas SPA falla con 404
- Build process puede sobrescribir configuraciones manuales

### Target Architecture
```
src/
├── amplify-setup.ts          # Configuración aislada de Amplify
├── main.tsx                  # Entry point limpio con import ordenado
├── lib/amplify.ts           # Cliente de datos (sin configuración)
└── App.tsx                  # Aplicación principal
```

## Components and Interfaces

### 1. Amplify Setup Module (`src/amplify-setup.ts`)

**Purpose**: Archivo de "efecto secundario" que contiene únicamente la configuración de Amplify.

**Interface**:
```typescript
// No exports - solo efectos secundarios
import { Amplify } from 'aws-amplify';

// Configuración hardcoded ejecutada inmediatamente
Amplify.configure({
  // ... configuración completa
});
```

**Key Design Decisions**:
- No exporta nada (solo efectos secundarios)
- Configuración hardcoded para evitar dependencias adicionales
- Se ejecuta inmediatamente al importarse

### 2. Refactored Entry Point (`src/main.tsx`)

**Purpose**: Entry point limpio que garantiza orden de ejecución correcto.

**Interface**:
```typescript
import './amplify-setup';     // PRIMERA LÍNEA OBLIGATORIA
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Solo lógica de renderizado
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

**Key Design Decisions**:
- Import de amplify-setup como primera línea
- Eliminación de configuración de Amplify de main.tsx
- Mantenimiento de estructura de renderizado existente

### 3. CloudFront Rewrite Configuration

**Purpose**: Configuración de rutas SPA para manejar navegación directa.

**Configuration**:
```
Source: </^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|map|json)$)([^.]+$)/>
Target: /index.html
Type: 200 (Rewrite)
```

**Key Design Decisions**:
- Regex pattern que excluye archivos estáticos
- Rewrite (200) en lugar de redirect (301/302)
- Preserva funcionalidad de archivos estáticos

## Data Models

### Configuration Object Structure
```typescript
interface AmplifyConfig {
  auth: {
    user_pool_id: string;
    aws_region: string;
    user_pool_client_id: string;
    identity_pool_id: string;
    // ... otros campos de auth
  };
  data: {
    url: string;
    aws_region: string;
    api_key: string;
    // ... otros campos de data
  };
  storage: {
    aws_region: string;
    bucket_name: string;
    buckets: StorageBucket[];
  };
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Rewrite Rule Pattern Validation
*For any* file path, the CloudFront rewrite regex should correctly identify static files (with extensions like css, js, png) and exclude them from SPA routing, while including paths without extensions or with non-static extensions
**Validates: Requirements 2.3**

## Error Handling

### Configuration Loading Errors
- If Amplify configuration fails, the application should fail fast with clear error messages
- Invalid configuration should be caught at startup, not during runtime
- Missing environment variables should be reported with specific guidance

### Build Process Errors
- Build should fail if amplify-setup.ts is missing or malformed
- Import order violations should be detected during build
- Missing rewrite configuration should be flagged during deployment

### Runtime Errors
- SPA routing failures should gracefully fallback to error pages
- Authentication errors should provide clear user feedback
- Storage access errors should not crash the application

## Testing Strategy

### Unit Testing Approach
- **File Structure Tests**: Verify that required files exist and have correct content
- **Import Order Tests**: Validate that main.tsx imports amplify-setup first
- **Configuration Tests**: Ensure Amplify configuration object is valid
- **Regex Pattern Tests**: Test rewrite rule pattern against various file paths

### Property-Based Testing Approach
- **Rewrite Pattern Property**: Test regex pattern against generated file paths
- Use property-based testing library: **fast-check** for TypeScript
- Minimum 100 iterations per property test
- Each test tagged with: **Feature: amplify-configuration-fix, Property {number}: {property_text}**

### Integration Testing Notes
- SPA routing behavior requires deployment testing (outside unit test scope)
- Build process verification requires CI/CD pipeline testing
- Amplify Console behavior requires manual verification

### Test Configuration
- Property tests run with minimum 100 iterations
- Unit tests focus on file structure and configuration validation
- Integration tests handled separately in deployment pipeline