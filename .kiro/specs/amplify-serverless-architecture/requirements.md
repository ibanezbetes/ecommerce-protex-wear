# Requirements Document

## Introduction

Arquitectura serverless 100% Cloud Native para la tienda online Protex Wear usando AWS Amplify Gen 2 (Code-first). El objetivo es crear una solución escalable, sin costes residuales, con personalización total de la Intranet/App, optimizada para un distribuidor de ropa laboral y EPIs con catálogo masivo y lógica B2B.

## Glossary

- **Amplify_App**: Aplicación AWS Amplify Gen 2 que gestiona toda la infraestructura
- **React_Frontend**: Aplicación frontend desarrollada en React (Next.js o Vite)
- **Cognito_Auth**: Sistema de autenticación Amazon Cognito para clientes y administradores
- **DynamoDB_Data**: Base de datos NoSQL Amazon DynamoDB para almacenar productos y pedidos
- **S3_Storage**: Almacenamiento Amazon S3 para imágenes de productos
- **GraphQL_API**: API GraphQL usando AWS AppSync para operaciones de datos
- **Data_Manager**: Panel administrativo nativo de Amplify para gestión de productos
- **Lambda_Functions**: Funciones AWS Lambda para lógica de negocio (pagos, envíos)

## Requirements

### Requirement 1: Configuración Base AWS Amplify Gen 2

**User Story:** Como DevOps Lead, quiero inicializar un proyecto Amplify Gen 2 code-first, para que el equipo tenga una base serverless escalable y reproducible.

#### Acceptance Criteria

1. WHEN se inicializa el proyecto, THE Amplify_App SHALL usar npm create amplify@latest para crear la estructura base
2. WHEN se configura el proyecto, THE Amplify_App SHALL usar TypeScript como lenguaje principal
3. WHEN se establece la arquitectura, THE Amplify_App SHALL seguir el patrón code-first de Amplify Gen 2
4. THE Amplify_App SHALL configurar automáticamente CI/CD conectando la rama main de GitHub a Amplify Hosting

### Requirement 2: Sistema de Autenticación Multi-Rol

**User Story:** Como arquitecto del sistema, quiero implementar autenticación con Amazon Cognito, para que clientes y administradores tengan acceso diferenciado al sistema.

#### Acceptance Criteria

1. WHEN se configura la autenticación, THE Cognito_Auth SHALL crear un User Pool con soporte para múltiples roles
2. WHEN un usuario se registra, THE Cognito_Auth SHALL asignar el rol 'CUSTOMER' por defecto
3. WHEN se crean administradores, THE Cognito_Auth SHALL permitir asignación manual del rol 'ADMIN'
4. THE Cognito_Auth SHALL integrar automáticamente con el frontend React para login/logout
5. THE Cognito_Auth SHALL proporcionar tokens JWT para autorización en la API

### Requirement 3: Modelo de Datos DynamoDB

**User Story:** Como Data Architect, quiero definir modelos de datos en DynamoDB, para que el sistema pueda almacenar productos, pedidos y usuarios de forma escalable.

#### Acceptance Criteria

1. WHEN se define el modelo Product, THE DynamoDB_Data SHALL incluir campos SKU, Nombre, Precio, Stock, Imagen
2. WHEN se define el modelo Order, THE DynamoDB_Data SHALL incluir campos ID, UserID, Productos, Estado, Total
3. WHEN se define el modelo User, THE DynamoDB_Data SHALL incluir campo Role con valores 'ADMIN' o 'CUSTOMER'
4. THE DynamoDB_Data SHALL configurar índices secundarios globales para consultas eficientes por SKU y UserID
5. THE DynamoDB_Data SHALL usar el archivo resource.ts para definir la estructura de datos

### Requirement 4: API GraphQL con Reglas de Acceso

**User Story:** Como desarrollador backend, quiero una API GraphQL con AppSync, para que el frontend pueda realizar operaciones CRUD con reglas de seguridad apropiadas.

#### Acceptance Criteria

1. WHEN se configura la API, THE GraphQL_API SHALL usar AWS AppSync como servicio principal
2. WHEN se definen permisos de lectura, THE GraphQL_API SHALL permitir allow.publicApiKey() para leer productos
3. WHEN se definen permisos de escritura, THE GraphQL_API SHALL requerir allow.authenticated() para crear pedidos
4. WHEN se definen permisos administrativos, THE GraphQL_API SHALL requerir rol 'ADMIN' para gestionar productos
5. THE GraphQL_API SHALL generar automáticamente el cliente TypeScript para el frontend

### Requirement 5: Almacenamiento de Imágenes S3

**User Story:** Como desarrollador frontend, quiero almacenar imágenes de productos en S3, para que el sistema pueda manejar contenido multimedia de forma escalable.

#### Acceptance Criteria

1. WHEN se configura el almacenamiento, THE S3_Storage SHALL crear un bucket dedicado para imágenes de productos
2. WHEN se suben imágenes, THE S3_Storage SHALL generar URLs públicas para acceso desde el frontend
3. WHEN se eliminan productos, THE S3_Storage SHALL limpiar automáticamente las imágenes asociadas
4. THE S3_Storage SHALL configurar políticas de acceso que permitan lectura pública y escritura autenticada
5. THE S3_Storage SHALL integrar con el modelo Product para referencias automáticas

### Requirement 6: Entorno de Desarrollo Local

**User Story:** Como desarrollador frontend, quiero poder desarrollar localmente contra la nube, para que pueda iterar rápidamente sin afectar el entorno de producción.

#### Acceptance Criteria

1. WHEN se ejecuta npx ampx sandbox, THE Amplify_App SHALL crear un entorno de desarrollo temporal en AWS
2. WHEN se desarrolla localmente, THE React_Frontend SHALL conectar automáticamente al sandbox de AWS
3. WHEN se realizan cambios en el código, THE Amplify_App SHALL sincronizar automáticamente con el sandbox
4. THE Amplify_App SHALL proporcionar hot-reload para cambios en el frontend y backend
5. THE Amplify_App SHALL limpiar automáticamente recursos del sandbox al finalizar la sesión

### Requirement 7: Funciones Lambda para Lógica de Negocio

**User Story:** Como desarrollador backend, quiero implementar funciones Lambda, para que el sistema pueda procesar pagos con Stripe y calcular envíos complejos.

#### Acceptance Criteria

1. WHEN se configura la estructura, THE Lambda_Functions SHALL organizarse en la carpeta amplify/functions
2. WHEN se procesa un pago, THE Lambda_Functions SHALL integrar con webhooks de Stripe
3. WHEN se calcula un envío, THE Lambda_Functions SHALL aplicar lógica de negocio compleja basada en ubicación y peso
4. THE Lambda_Functions SHALL usar TypeScript y compartir tipos con el frontend
5. THE Lambda_Functions SHALL integrarse automáticamente con la API GraphQL como resolvers

### Requirement 8: Panel Administrativo Nativo

**User Story:** Como QA Manager, quiero usar el Amplify Data Manager nativo, para que el dueño pueda gestionar productos sin necesidad de programar un panel personalizado.

#### Acceptance Criteria

1. WHEN se accede al Data Manager, THE Data_Manager SHALL mostrar una interfaz web para gestión de productos
2. WHEN se crean productos, THE Data_Manager SHALL permitir subir imágenes y definir todos los campos del modelo
3. WHEN se gestionan pedidos, THE Data_Manager SHALL permitir cambiar estados y ver detalles completos
4. THE Data_Manager SHALL respetar las reglas de autorización definidas en el esquema GraphQL
5. THE Data_Manager SHALL generar automáticamente formularios basados en los modelos de datos

### Requirement 9: Migración de Datos Inicial

**User Story:** Como Data Migration Specialist, quiero crear un script de migración, para que los productos existentes se puedan importar desde JSON/CSV a DynamoDB.

#### Acceptance Criteria

1. WHEN se ejecuta el script de migración, THE Migration_Script SHALL leer datos desde archivos JSON/CSV
2. WHEN se procesan los datos, THE Migration_Script SHALL usar la SDK de AWS con generateClient para insertar en DynamoDB
3. WHEN se encuentran errores, THE Migration_Script SHALL registrar logs detallados y continuar con el siguiente registro
4. THE Migration_Script SHALL validar la estructura de datos antes de la inserción
5. THE Migration_Script SHALL proporcionar un reporte final con estadísticas de migración exitosa/fallida

### Requirement 10: CI/CD y Despliegue Automático

**User Story:** Como DevOps Lead, quiero configurar CI/CD automático, para que los cambios en la rama main se desplieguen automáticamente a producción.

#### Acceptance Criteria

1. WHEN se hace push a main, THE Amplify_App SHALL detectar automáticamente los cambios
2. WHEN se inicia el build, THE Amplify_App SHALL ejecutar tests unitarios y de integración
3. WHEN los tests pasan, THE Amplify_App SHALL desplegar automáticamente frontend y backend
4. THE Amplify_App SHALL proporcionar URLs de preview para ramas de feature
5. THE Amplify_App SHALL mantener rollback automático en caso de fallos en el despliegue