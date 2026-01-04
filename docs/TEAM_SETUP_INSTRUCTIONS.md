# 🚀 Protex Wear - Instrucciones de Setup por Equipo

**Fecha**: 4 de Enero 2026  
**Urgente**: Para distribución inmediata al equipo  
**Objetivo**: Configuración completa para trabajo desde mañana  

---

## 👨‍💻 YERAY & OCTAVIO (Frontend Developers)

### 📋 Prerrequisitos
- **Node.js**: Versión 18.x o superior (recomendado: 20.x LTS)
- **npm**: Viene incluido con Node.js
- **Git**: Para clonar el repositorio
- **AWS CLI**: Configurado con credenciales (pedir a Ibañez si no tienes)

### 🔧 Setup Paso a Paso

#### 1. Clonar el Repositorio
```bash
git clone https://github.com/ibanezbetes/protex-wear-serverless.git
cd protex-wear-serverless
```

#### 2. Instalar Dependencias
```bash
npm install
```

#### 3. Configurar AWS CLI (si no está configurado)
```bash
aws configure
# Pedir credenciales a Ibañez:
# - AWS Access Key ID
# - AWS Secret Access Key  
# - Region: eu-west-1
# - Output format: json
```

#### 4. Iniciar Backend Local (Sandbox)
```bash
npm run dev
```
**⚠️ IMPORTANTE**: Este comando puede tardar 5-10 minutos la primera vez. Esperad a ver:
```
✅ Amplify sandbox deployed successfully
📋 amplify_outputs.json generated
🚀 Sandbox is running and watching for changes...
```

#### 5. Iniciar Frontend (en otra terminal)
```bash
# En otra terminal, desde la misma carpeta
cd src
npm run dev
# Abrir http://localhost:5173
```

### 📁 Estructura Frontend (dónde trabajar)

```
src/
├── components/          # 🎨 Componentes reutilizables
│   ├── layout/         # Header, Footer, Navigation
│   ├── auth/           # Login, Register, ProtectedRoute
│   └── ui/             # Buttons, Forms, Cards, etc.
├── pages/              # 📄 Páginas principales
│   ├── HomePage.tsx    # Landing page
│   ├── ProductsPage.tsx # Catálogo de productos
│   ├── CartPage.tsx    # Carrito de compras
│   └── AdminDashboard.tsx # Panel admin
├── contexts/           # 🔄 Estado global
│   ├── AuthContext.tsx # Autenticación
│   └── CartContext.tsx # Carrito
├── hooks/              # 🪝 Custom hooks
├── services/           # 🌐 GraphQL queries
└── types/              # 📝 TypeScript types
```

### 🎯 Tareas Prioritarias
1. **Responsive Design**: Hacer mobile-friendly todas las páginas
2. **UI/UX Polish**: Mejorar componentes existentes
3. **Performance**: Optimizar carga de imágenes y componentes
4. **Testing**: Añadir tests para componentes críticos

### 🆘 Troubleshooting
- **Error "AWS credentials"**: Pedir credenciales a Ibañez
- **Error "amplify command not found"**: `npm install -g @aws-amplify/cli`
- **Puerto 5173 ocupado**: Cambiar puerto en vite.config.ts
- **Sandbox no despliega**: Verificar permisos AWS con Ibañez

---

## 📊 LAZAR (Data Migration Specialist)

### 📋 Prerrequisitos
- **Node.js**: Versión 18.x o superior
- **Acceso al repositorio**: Clonar como se indica arriba
- **Sandbox activo**: Alguien del equipo debe tener `npm run dev` ejecutándose

### 🔧 Setup Paso a Paso

#### 1. Clonar y Configurar
```bash
git clone https://github.com/ibanezbetes/protex-wear-serverless.git
cd protex-wear-serverless
npm install
```

#### 2. Verificar Sandbox Activo
```bash
# Verificar que amplify_outputs.json existe
ls -la amplify_outputs.json
# Si no existe, ejecutar: npm run dev (y esperar 5-10 min)
```

### 📁 Dónde Trabajar

#### Archivos de Datos
```
migration/
├── seed.ts                    # 🔧 Script principal (YA IMPLEMENTADO)
├── products_source.json       # 📦 Datos de ejemplo (REEMPLAZAR)
└── [tus_archivos].json        # 📊 Tus datos reales aquí
```

#### Formato JSON Requerido
```json
[
  {
    "sku": "PW-001",
    "name": "Casco de Seguridad",
    "description": "Casco homologado CE",
    "price": 29.99,
    "stock": 100,
    "category": "EPIs",
    "subcategory": "Protección Cabeza",
    "brand": "Protex",
    "imageUrl": "https://...",
    "imageUrls": ["https://...", "https://..."],
    "specifications": {
      "material": "ABS",
      "peso": "350g",
      "certificacion": "EN 397"
    },
    "weight": 0.35,
    "dimensions": {
      "length": 25,
      "width": 20,
      "height": 15
    },
    "tags": ["seguridad", "obra", "construccion"]
  }
]
```

### 🚀 Comandos de Migración

#### Migración Básica
```bash
# Reemplazar products_source.json con tus datos
npm run seed
```

#### Migración con Logging Detallado
```bash
# Para ver logs detallados
npm run seed 2>&1 | tee migration.log
```

#### Verificar Datos Migrados
```bash
# Abrir AWS Console > DynamoDB > Tables > Product-[id]
# O usar GraphQL playground en AppSync Console
```

### 🎯 Tareas Prioritarias
1. **Preparar datos reales**: Convertir sistema actual a JSON
2. **Validar formato**: Usar el ejemplo como referencia
3. **Migración por lotes**: Si tienes muchos productos, dividir en archivos
4. **Backup**: Guardar datos originales antes de migrar

### 🆘 Troubleshooting
- **Error "amplify_outputs.json not found"**: Alguien debe ejecutar `npm run dev`
- **Error GraphQL**: Verificar formato JSON exacto
- **Productos duplicados**: El script maneja duplicados por SKU
- **Fallos parciales**: El script continúa con errores, revisa logs

---

## ⚡ MARIO & JESÚS (Backend/Business Logic)

### 📋 Prerrequisitos
- **Node.js**: Versión 18.x o superior
- **TypeScript**: Conocimiento básico
- **AWS Lambda**: Conceptos básicos

### 🔧 Setup Paso a Paso

#### 1. Clonar y Configurar
```bash
git clone https://github.com/ibanezbetes/protex-wear-serverless.git
cd protex-wear-serverless
npm install
```

#### 2. Iniciar Sandbox (para testing)
```bash
npm run dev
# Esperar a que despliegue completamente
```

### 📁 Dónde Trabajar

#### Funciones Lambda (Código)
```
amplify/functions/
├── stripe-webhook/           # 💳 Procesamiento pagos
│   ├── handler.ts           # Lógica principal
│   └── package.json         # Dependencias
├── shipping-calculator/      # 📦 Cálculo envíos
│   ├── handler.ts           # Lógica de precios
│   └── package.json         # Dependencias
├── pre-sign-up/             # 👤 Registro usuarios
└── post-confirmation/       # 🔐 Asignación roles
```

#### Configuración Principal
```
amplify/
├── backend.ts               # 🏗️ Configuración general
├── data/resource.ts         # 📊 Modelos de datos
└── auth/resource.ts         # 🔐 Autenticación
```

### 🎯 Reglas de Negocio Actuales

#### Shipping Calculator (amplify/functions/shipping-calculator/handler.ts)
```typescript
// REGLAS ACTUALES (podéis modificar):
const SHIPPING_RATES = {
  'ES-PENINSULA': { base: 5.99, perKg: 1.50 },
  'ES-BALEARES': { base: 12.99, perKg: 2.00 },
  'ES-CANARIAS': { base: 19.99, perKg: 3.00 },
  'INTERNATIONAL': { base: 25.99, perKg: 4.00 }
};

const CUSTOMER_DISCOUNTS = {
  'PREMIUM': 0.15,    // 15% descuento
  'STANDARD': 0.05,   // 5% descuento
  'NEW': 0.00         // Sin descuento
};

const FREE_SHIPPING_THRESHOLD = 150.00; // Envío gratis >150€
```

#### Stripe Webhook (amplify/functions/stripe-webhook/handler.ts)
```typescript
// EVENTOS PROCESADOS:
- payment_intent.succeeded    // Pago exitoso
- payment_intent.payment_failed // Pago fallido
- invoice.payment_succeeded   // Factura pagada
- customer.subscription.created // Nueva suscripción
```

### 🔧 Cómo Modificar Reglas

#### Opción 1: Modificar Código Directamente
```bash
# Editar archivo
code amplify/functions/shipping-calculator/handler.ts

# Desplegar cambios
npm run dev  # El sandbox redespliega automáticamente
```

#### Opción 2: Definir Reglas en Formato JSON
Si preferís no tocar código, pasadme las reglas en este formato:

```json
{
  "shipping": {
    "zones": {
      "ES-PENINSULA": { "base": 5.99, "perKg": 1.50 },
      "ES-BALEARES": { "base": 12.99, "perKg": 2.00 }
    },
    "discounts": {
      "PREMIUM": 0.15,
      "STANDARD": 0.05
    },
    "freeShippingThreshold": 150.00
  },
  "pricing": {
    "taxRate": 0.21,
    "bulkDiscounts": {
      "10": 0.05,
      "50": 0.10,
      "100": 0.15
    }
  }
}
```

### 🎯 Tareas Prioritarias
1. **Revisar reglas actuales**: Ver si están correctas
2. **Stripe integration**: Completar webhooks
3. **Notificaciones**: Email/SMS para pedidos
4. **Reportes**: Analytics y métricas

### 🆘 Troubleshooting
- **Lambda no despliega**: Verificar sintaxis TypeScript
- **Errores en logs**: `aws logs tail /aws/lambda/[function-name] --follow`
- **Testing**: Usar GraphQL playground para probar
- **Hot reload**: Los cambios se despliegan automáticamente

---

## 🔍 LALANZA (QA & Admin Management)

### 📋 Prerrequisitos
- **Navegador web**: Chrome/Firefox actualizado
- **Credenciales admin**: Pedir a Ibañez
- **Acceso a AWS Console**: Para Data Manager

### 🔧 Setup Paso a Paso

#### 1. Credenciales de Acceso
**Pedir a Ibañez**:
- Email admin para Cognito
- Password temporal
- URL del Data Manager (cuando esté activo)

#### 2. URLs de Trabajo

##### Desarrollo (Sandbox)
```
Frontend React: http://localhost:5173
AWS Console: https://eu-west-1.console.aws.amazon.com/
Cognito Users: https://eu-west-1.console.aws.amazon.com/cognito/
DynamoDB Tables: https://eu-west-1.console.aws.amazon.com/dynamodb/
AppSync GraphQL: https://eu-west-1.console.aws.amazon.com/appsync/
```

##### Data Manager (Próximamente)
```
URL: [Pendiente - Task 12]
Credenciales: [Pedir a Ibañez cuando esté listo]
```

### 🎯 Áreas de Testing

#### 1. Gestión de Productos
- [ ] Crear productos nuevos
- [ ] Editar productos existentes
- [ ] Subir imágenes de productos
- [ ] Gestionar stock y precios
- [ ] Categorización y etiquetado

#### 2. Gestión de Usuarios
- [ ] Registro de nuevos usuarios
- [ ] Asignación de roles (ADMIN/CUSTOMER)
- [ ] Gestión de empresas y perfiles
- [ ] Permisos por rol

#### 3. Gestión de Pedidos
- [ ] Crear pedidos de prueba
- [ ] Cambiar estados de pedidos
- [ ] Procesar pagos (modo test)
- [ ] Generar reportes

#### 4. Interface Testing
- [ ] Responsive design (móvil/tablet)
- [ ] Navegación y usabilidad
- [ ] Formularios y validaciones
- [ ] Mensajes de error y éxito

### 📋 Checklist de QA

#### Funcionalidades Críticas
- [ ] Login/Logout funciona
- [ ] Registro de usuarios funciona
- [ ] Catálogo de productos carga
- [ ] Carrito de compras funciona
- [ ] Proceso de checkout completo
- [ ] Panel admin accesible
- [ ] Gestión de productos CRUD
- [ ] Permisos por rol correctos

#### Cross-Browser Testing
- [ ] Chrome (desktop/mobile)
- [ ] Firefox (desktop/mobile)
- [ ] Safari (si tienes Mac/iPhone)
- [ ] Edge (si tienes Windows)

### 🆘 Troubleshooting
- **No puedo acceder**: Verificar credenciales con Ibañez
- **Errores en formularios**: Capturar screenshot y reportar
- **Data Manager no funciona**: Esperar a Task 12 (próximos días)
- **Performance lenta**: Reportar tiempos de carga

---

## 🚨 INFORMACIÓN CRÍTICA PARA TODOS

### 🔐 Credenciales y Accesos
**Contactar a Ibañez para**:
- AWS Access Keys (Yeray, Octavio, Lazar)
- Credenciales admin Cognito (Lalanza)
- Acceso a 1Password compartido
- Invitación a Slack del proyecto

### 📞 Canales de Comunicación
- **Slack**: Canal principal para updates diarios
- **GitHub Issues**: Para bugs y features técnicos
- **Email**: Para temas urgentes o confidenciales

### 🆘 Escalation Path
1. **Problemas técnicos**: Kiro AI Assistant (GitHub Issues)
2. **Credenciales/Accesos**: Ibañez (Slack/Email)
3. **Decisiones de producto**: Ibañez
4. **AWS/Infrastructure**: Kiro + AWS Support

### ⏰ Timeline Crítico
- **Hoy**: Distribución de instrucciones
- **Mañana**: Setup completo de todos
- **Esta semana**: Tasks 11-12 (CI/CD + Data Manager)
- **Próxima semana**: Tasks 13-14 (Testing + Go-Live)

---

## 📋 Checklist de Verificación

### Para Cada Miembro del Equipo
- [ ] Repositorio clonado correctamente
- [ ] Dependencias instaladas (`npm install`)
- [ ] Credenciales AWS configuradas
- [ ] Sandbox desplegado (`npm run dev`)
- [ ] Acceso a herramientas específicas de su rol
- [ ] Comunicación establecida (Slack)

### Confirmación de Setup
**Enviar a Ibañez cuando completéis**:
- ✅ Setup completado
- ✅ Sandbox funcionando
- ✅ Acceso a herramientas
- ❌ Problemas encontrados (detallar)

---

**¡Importante!** Si tenéis cualquier problema durante el setup, contactad inmediatamente con Ibañez. No perdáis tiempo troubleshooting solos - el objetivo es que todos estéis operativos mañana.

**¡Éxito en el nuevo entorno!** 🚀