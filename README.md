# Protex Wear - Serverless E-commerce Platform

**Estado**: 🚀 ARQUITECTURA SERVERLESS EN DESARROLLO  
**Fecha**: 4 de Enero 2026  
**Responsable**: Kiro (DevOps & IaaC Lead)  
**Coordinador**: Daniel Jesús Ibáñez Betés  

## 🏗️ Arquitectura

Plataforma e-commerce 100% serverless usando AWS Amplify Gen 2 (code-first) para distribuidor de ropa laboral y EPIs.

### Stack Tecnológico

- **Framework**: AWS Amplify Gen 2
- **Frontend**: React (TypeScript)
- **Auth**: Amazon Cognito (Multi-rol: ADMIN/CUSTOMER)
- **Data**: Amazon DynamoDB (NoSQL)
- **Storage**: Amazon S3 (Imágenes de productos)
- **API**: AWS AppSync (GraphQL)
- **Functions**: AWS Lambda (Stripe, Envíos)
- **Admin**: Amplify Data Manager (Nativo)

## 🚀 Comandos Rápidos

```bash
# Desarrollo local con sandbox
npm run dev

# Build del proyecto
npm run build

# Deploy a producción
npm run deploy

# Tests
npm test
npm run test:watch
```

## 👥 Equipo y Responsabilidades

### 1. Kiro (DevOps & IaaC Lead)
- ✅ Inicialización Amplify Gen 2
- 🔄 CI/CD y Amplify Hosting
- 🔄 Configuración sandbox y entornos

### 2. Ibañez (Data Architect)
- 🔄 Modelos de datos en `amplify/data/resource.ts`
- 🔄 Esquemas Product, Order, User

### 3. Yeray y Octavio (Frontend Developers)
- 🔄 Aplicación React en `/src`
- 🔄 Integración con Amplify Auth y API

### 4. Lazar (Data Migration Specialist)
- 🔄 Script Node.js para migración JSON/CSV → DynamoDB
- 🔄 Uso de AWS SDK con generateClient

### 5. Mario y Jesús (Backend Developers)
- 🔄 Funciones Lambda en `amplify/functions/`
- 🔄 Integración Stripe y cálculo de envíos

### 6. Lalanza (QA & Admin Management)
- 🔄 Testing del Amplify Data Manager
- 🔄 Capacitación para gestión de productos

## 📁 Estructura del Proyecto

```
protex-wear-serverless/
├── amplify/                 # Configuración Amplify Gen 2
│   ├── auth/               # Configuración Cognito
│   ├── data/               # Modelos DynamoDB + GraphQL
│   ├── storage/            # Configuración S3
│   ├── functions/          # Funciones Lambda
│   └── backend.ts          # Configuración principal
├── src/                    # Frontend React
├── migration/              # Scripts de migración de datos
├── tests/                  # Tests unitarios y de propiedades
└── .kiro/specs/           # Especificaciones del proyecto
```

## 🔧 Configuración Inicial

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar AWS CLI** (si no está configurado):
   ```bash
   aws configure
   ```

3. **Iniciar sandbox de desarrollo**:
   ```bash
   npm run dev
   ```

## 📋 Estado de Implementación

Ver progreso detallado en: `.kiro/specs/amplify-serverless-architecture/tasks.md`

- ✅ **Tarea 1**: Inicialización Amplify Gen 2
- 🔄 **Tarea 2**: Configuración Cognito
- ⏳ **Tarea 3**: Modelos DynamoDB
- ⏳ **Tarea 4**: Storage S3
- ⏳ **Tareas 5-14**: Funciones Lambda, Frontend, CI/CD, etc.

## 🔗 Enlaces Importantes

- **Repositorio**: https://github.com/ibanezbetes/protex-wear-serverless
- **Documentación Amplify**: https://docs.amplify.aws/
- **Especificaciones**: `.kiro/specs/amplify-serverless-architecture/`

## 📞 Contacto

**Coordinador del Proyecto**: Daniel Jesús Ibáñez Betés  
**DevOps Lead**: Kiro AI Assistant