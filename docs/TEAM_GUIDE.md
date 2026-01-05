# Guía del Equipo - Protex Wear

Esta guía proporciona instrucciones específicas para cada rol del equipo de desarrollo.

## 🎯 Información General

### Estado del Proyecto
- **Backend**: ✅ Completamente funcional (AWS Amplify Gen 2)
- **Frontend**: ✅ Aplicación React desplegada y operativa
- **Autenticación**: ✅ AWS Cognito configurado
- **Base de Datos**: ✅ DynamoDB con modelos Product, Order, User
- **Despliegue**: ✅ Pipeline CI/CD en Amplify Hosting

### URLs Importantes
- **Producción**: https://dev.dw4alzwzez7pl.amplifyapp.com
- **Repositorio**: https://github.com/ibanezbetes/ecommerce-protex-wear
- **Consola AWS**: https://console.aws.amazon.com (región: eu-west-1)

---

## 👨‍💻 Frontend Developers

### Setup Inicial

1. **Clonar y configurar**:
```bash
git clone https://github.com/ibanezbetes/ecommerce-protex-wear.git
cd ecommerce-protex-wear
npm install
```

2. **Obtener configuración**:
   - Solicita `amplify_outputs.json` al Project Lead
   - Colócalo en la raíz del proyecto
   - **NUNCA** lo subas a Git

3. **Ejecutar en desarrollo**:
```bash
npm run dev
```

### Estructura de Código Frontend

#### Componentes Principales
```
src/components/
├── layout/
│   ├── Header.tsx          # Navegación + Auth
│   └── Footer.tsx          # Footer del sitio
├── auth/
│   ├── ProtectedRoute.tsx  # HOC para rutas protegidas
│   └── LoadingSpinner.tsx  # Componente de carga
└── ui/                     # Componentes reutilizables
```

#### Hooks Personalizados
```
src/hooks/
├── useProducts.ts          # Gestión de productos (CRUD)
├── useAuth.ts             # Estado de autenticación
└── useCart.ts             # Carrito de compras
```

#### Páginas Disponibles
```
src/pages/
├── HomePage.tsx           # Landing page
├── ProductsPage.tsx       # Catálogo con filtros
├── ProductDetailPage.tsx  # Detalle de producto
├── CartPage.tsx          # Carrito de compras
├── CheckoutPage.tsx      # Proceso de compra
├── LoginPage.tsx         # Inicio de sesión
├── RegisterPage.tsx      # Registro de usuarios
├── ProfilePage.tsx       # Perfil de usuario
└── AdminDashboard.tsx    # Panel de administración
```

### Trabajar con Datos

#### Hook useProducts (Ejemplo)
```typescript
import { useProducts } from '../hooks/useProducts';

function ProductsPage() {
  const { 
    products, 
    loading, 
    error, 
    fetchProducts, 
    searchProducts 
  } = useProducts();

  // Los productos se cargan automáticamente
  // Usar searchProducts(term) para búsquedas
  // Manejar loading y error states
}
```

#### Autenticación
```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // user contiene: id, email, role, firstName, lastName
  // isAuthenticated: boolean
  // login(email, password): Promise<void>
  // logout(): Promise<void>
}
```

### Estilos y Diseño

#### Variables CSS Disponibles
```css
/* Colores principales */
--primary-color: #2563eb;
--secondary-color: #64748b;
--accent-color: #f59e0b;

/* Espaciado */
--spacing-4: 1rem;
--spacing-6: 1.5rem;
--spacing-8: 2rem;

/* Tipografía */
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
```

#### Clases Utilitarias
```css
.btn-primary     /* Botón principal azul */
.btn-secondary   /* Botón secundario gris */
.card           /* Tarjeta con sombra */
.container      /* Contenedor centrado */
.loading        /* Spinner de carga */
```

### Testing Frontend

```bash
# Ejecutar tests
npm test

# Tests en modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

---

## 🔧 Backend/Admin Developers

### Configuración del Backend

El backend está completamente configurado con AWS Amplify Gen 2. Los archivos principales son:

#### Esquema de Datos
```
amplify/data/resource.ts    # Modelos GraphQL + DynamoDB
```

#### Modelos Disponibles
- **Product**: SKU, name, price, stock, category, images, specifications
- **Order**: userId, items, totals, status, addresses, payment info
- **User**: email, role, company info, preferences

#### Autorización Configurada
- **Public**: Lectura de productos (sin auth)
- **Authenticated**: Crear pedidos, ver perfil
- **Admin**: CRUD completo en todos los modelos
- **Owner**: Ver solo sus propios pedidos

### Modificar el Esquema

Para cambiar modelos de datos:

1. **Editar** `amplify/data/resource.ts`
2. **Desplegar cambios**:
```bash
npx ampx sandbox
# Los cambios se aplican automáticamente
```

### GraphQL Operations

#### Queries Disponibles
```graphql
# Listar productos
listProducts(filter: ProductFilterInput, limit: Int)

# Buscar por SKU
productBySku(sku: String!)

# Productos por categoría
productsByCategory(category: String!)

# Pedidos por usuario
ordersByUser(userId: String!)
```

#### Mutations Disponibles
```graphql
# Crear producto (Admin only)
createProduct(input: CreateProductInput!)

# Actualizar producto (Admin only)
updateProduct(input: UpdateProductInput!)

# Crear pedido (Authenticated)
createOrder(input: CreateOrderInput!)
```

### Gestión de Usuarios

#### Roles de Usuario
- **CUSTOMER**: Usuario estándar (puede comprar)
- **ADMIN**: Administrador (gestión completa)

#### Cambiar Rol de Usuario
1. Ir a AWS Cognito Console
2. Seleccionar User Pool
3. Buscar usuario
4. Editar atributo `custom:role`

### Funciones Lambda

Si necesitas agregar funciones Lambda:

1. **Crear función**:
```
amplify/functions/mi-funcion/
├── handler.ts
├── package.json
└── tsconfig.json
```

2. **Registrar en backend**:
```typescript
// amplify/backend.ts
import { miFuncion } from './functions/mi-funcion/resource';

export const backend = defineBackend({
  // ... otros recursos
  miFuncion
});
```

---

## 🗄️ Database/Data Managers

### Acceso a Datos

#### AWS Console
- **DynamoDB**: https://console.aws.amazon.com/dynamodb
- **Región**: eu-west-1
- **Tablas**: Product, Order, User (con prefijos automáticos)

#### Amplify Data Manager
1. Ir a AWS Amplify Console
2. Seleccionar la aplicación
3. Ir a "Data" → "Data manager"
4. Gestionar productos, pedidos y usuarios visualmente

### Estructura de Datos

#### Tabla Product
```json
{
  "id": "uuid",
  "sku": "PROT-001",
  "name": "Casco de Seguridad",
  "description": "Casco profesional...",
  "price": 29.99,
  "stock": 100,
  "category": "Protección Cabeza",
  "subcategory": "Cascos",
  "brand": "Protex",
  "imageUrl": "https://...",
  "imageUrls": ["https://..."],
  "specifications": {
    "material": "ABS",
    "color": "Blanco",
    "tallas": ["M", "L", "XL"]
  },
  "isActive": true,
  "createdAt": "2026-01-05T...",
  "updatedAt": "2026-01-05T..."
}
```

#### Tabla Order
```json
{
  "id": "uuid",
  "userId": "user-uuid",
  "customerEmail": "cliente@empresa.com",
  "customerName": "Juan Pérez",
  "customerCompany": "Construcciones ABC",
  "items": [
    {
      "productId": "product-uuid",
      "sku": "PROT-001",
      "name": "Casco de Seguridad",
      "price": 29.99,
      "quantity": 2,
      "subtotal": 59.98
    }
  ],
  "subtotal": 59.98,
  "taxAmount": 12.60,
  "shippingAmount": 5.00,
  "totalAmount": 77.58,
  "status": "PENDING",
  "shippingAddress": {
    "street": "Calle Principal 123",
    "city": "Madrid",
    "postalCode": "28001",
    "country": "España"
  },
  "orderDate": "2026-01-05T...",
  "createdAt": "2026-01-05T..."
}
```

### Migración de Datos

#### Script de Migración
```bash
# Migrar productos de ejemplo
npm run seed

# El script está en: migration/seed.ts
# Los datos están en: migration/products_source.json
```

#### Agregar Productos Manualmente
1. **Via Amplify Data Manager** (Recomendado)
2. **Via GraphQL Playground**
3. **Via Script personalizado**

### Backup y Restauración

#### Backup Manual
```bash
# Exportar tabla Product
aws dynamodb scan --table-name [ProductTableName] > backup-products.json

# Exportar tabla Order
aws dynamodb scan --table-name [OrderTableName] > backup-orders.json
```

---

## 🚀 DevOps/Deployment

### Pipeline CI/CD

El proyecto usa **Amplify Hosting** con despliegue automático:

#### Configuración Actual
- **Branch principal**: `dev`
- **URL producción**: https://dev.dw4alzwzez7pl.amplifyapp.com
- **Build automático**: Cada push a `dev`

#### Archivo de Build
```yaml
# amplify.yml
version: 1
backend:
  phases:
    build:
      commands:
        - npm install
        - npx ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
```

### Monitoreo

#### CloudWatch Logs
- **Lambda Functions**: `/aws/lambda/amplify-*`
- **AppSync**: `/aws/appsync/apis/[api-id]`

#### Métricas Importantes
- **Errores de autenticación**: Cognito metrics
- **Latencia GraphQL**: AppSync metrics
- **Errores de base de datos**: DynamoDB metrics

### Variables de Entorno

#### Amplify Console
1. Ir a Amplify Console
2. Seleccionar la app
3. "App settings" → "Environment variables"

#### Variables Críticas
- `AWS_REGION`: eu-west-1
- `NODE_ENV`: production
- Otras se generan automáticamente

---

## 🔐 Seguridad y Accesos

### Credenciales de Desarrollo

#### Usuarios de Prueba
Crear usuarios via la aplicación o Cognito Console:
- **Email**: cualquier email válido
- **Password**: Mínimo 8 caracteres (mayús, minus, número, símbolo)
- **Rol**: Se asigna automáticamente CUSTOMER

#### Promover a Admin
1. AWS Cognito Console
2. User Pools → [UserPoolId]
3. Users → Seleccionar usuario
4. Attributes → Edit `custom:role` → Cambiar a `ADMIN`

### Permisos AWS

#### Roles Necesarios
- **Amplify Service Role**: Para despliegues
- **Lambda Execution Role**: Para funciones
- **AppSync Service Role**: Para GraphQL

#### Políticas Mínimas
- `AWSAmplifyFullAccess`
- `AWSAppSyncAdministrator`
- `AmazonDynamoDBFullAccess`
- `AmazonS3FullAccess`
- `AmazonCognitoPowerUser`

---

## 🆘 Troubleshooting Común

### Error: "Auth UserPool not configured"
**Solución**: Verificar que `amplify_outputs.json` existe y es válido

### Error: "Cannot read properties of undefined (reading 'list')"
**Solución**: El cliente GraphQL no está inicializado. Verificar configuración de Amplify

### Error: "Access Denied" en GraphQL
**Solución**: Verificar que el usuario tiene el rol correcto y está autenticado

### Error: Build falla en Amplify
**Solución**: Verificar `amplify.yml` y que todas las dependencias están en `package.json`

### Error: CSS no se carga
**Solución**: Verificar que `import './index.css'` está en `main.tsx`

---

## 📞 Contactos del Equipo

### Project Lead
- **Responsabilidades**: Coordinación, arquitectura, credenciales
- **Contacto**: Slack/Email del proyecto

### Frontend Team
- **Responsabilidades**: UI/UX, componentes React, testing frontend
- **Archivos principales**: `src/components/`, `src/pages/`, `src/hooks/`

### Backend Team
- **Responsabilidades**: GraphQL, Lambda functions, base de datos
- **Archivos principales**: `amplify/data/`, `amplify/functions/`

### DevOps Team
- **Responsabilidades**: CI/CD, monitoreo, infraestructura
- **Herramientas**: Amplify Console, CloudWatch, AWS CLI

---

**Última actualización**: Enero 2026