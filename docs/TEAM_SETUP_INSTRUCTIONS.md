# Instrucciones de Setup por Miembro del Equipo

Este documento contiene instrucciones específicas para cada miembro del equipo Protex Wear.

## 🚀 Setup General (Todos)

### Prerrequisitos
- Node.js 18+ instalado
- Git configurado
- AWS CLI instalado: `npm install -g @aws-amplify/cli`

### Pasos Iniciales
```bash
git clone https://github.com/ibanezbetes/ecommerce-protex-wear.git
cd ecommerce-protex-wear
npm install
```

---

## 👨‍💻 **Yeray & Octavio** (Frontend Team)

### Tu Misión
Desarrollo de la interfaz de usuario, componentes React y diseño responsive.

### Setup Específico
1. **Configurar AWS CLI** con tus credenciales específicas:
```bash
aws configure
# Access Key ID: [PEDIR CREDENCIALES AL LEAD]
# Secret Access Key: [PEDIR CREDENCIALES AL LEAD]
# Region: eu-west-1
# Output format: json
```

2. **Obtener configuración del proyecto**:
   - Solicitar `amplify_outputs.json` al Project Lead
   - Colocarlo en la raíz del proyecto

3. **Ejecutar en desarrollo**:
```bash
npm run dev
```

### Tus Carpetas Principales
```
src/
├── components/     # 🎯 TU FOCO PRINCIPAL
│   ├── layout/     # Header, Footer, Navigation
│   ├── auth/       # Login, Register components
│   └── ui/         # Botones, Cards, Forms
├── pages/          # 🎯 TU FOCO PRINCIPAL
│   ├── HomePage.tsx
│   ├── ProductsPage.tsx
│   ├── CartPage.tsx
│   └── CheckoutPage.tsx
└── index.css       # 🎯 Estilos y responsive design
```

### Primeras Tareas Críticas
1. **Revisar componentes existentes** en `src/components/` y mejorar UI/UX
2. **Optimizar responsive design** - probar en móvil, tablet, desktop
3. **Mejorar ProductsPage.tsx** - filtros, búsqueda, paginación

### Herramientas de Desarrollo
```bash
npm run dev          # Servidor desarrollo
npm run build        # Build producción
npm run lint         # Linter código
```

### Testing Frontend
```bash
npm test             # Ejecutar tests
npm run test:watch   # Tests en modo watch
```

---

## 📊 **Lazar** (Migration Specialist)

### Tu Misión
Migración de datos desde el sistema actual y gestión de la base de datos.

### Setup Específico
1. **Configurar AWS CLI** con tus credenciales específicas:
```bash
aws configure
# Access Key ID: [PEDIR CREDENCIALES AL LEAD]
# Secret Access Key: [PEDIR CREDENCIALES AL LEAD]
# Region: eu-west-1
# Output format: json
```

2. **Obtener configuración del proyecto**:
   - Solicitar `amplify_outputs.json` al Project Lead
   - Colocarlo en la raíz del proyecto

### Tu Carpeta Principal
```
migration/
├── seed.ts                    # 🎯 TU FOCO PRINCIPAL
├── products_source.json       # 🎯 Datos de ejemplo
└── [nuevos archivos JSON]     # 🎯 Tus migraciones
```

### Estructura JSON para Productos
```json
{
  "products": [
    {
      "sku": "PROT-001",
      "name": "Casco de Seguridad Profesional",
      "description": "Casco de alta resistencia...",
      "price": 29.99,
      "stock": 150,
      "category": "Protección Cabeza",
      "subcategory": "Cascos",
      "brand": "Protex",
      "imageUrl": "https://ejemplo.com/imagen.jpg",
      "imageUrls": [
        "https://ejemplo.com/imagen1.jpg",
        "https://ejemplo.com/imagen2.jpg"
      ],
      "specifications": {
        "material": "ABS",
        "color": "Blanco",
        "tallas": ["M", "L", "XL"],
        "certificacion": "EN 397"
      },
      "tags": ["seguridad", "construccion", "obra"],
      "weight": 0.4,
      "dimensions": {
        "length": 25,
        "width": 20,
        "height": 15
      },
      "isActive": true
    }
  ]
}
```

### Primeras Tareas Críticas
1. **Ejecutar migración de prueba**: `npm run seed`
2. **Crear archivo JSON** con productos reales del sistema actual
3. **Validar estructura de datos** - verificar que todos los campos son correctos

### Comandos de Migración
```bash
npm run seed                   # Ejecutar migración
node migration/seed.ts         # Ejecutar directamente
```

### Verificación de Datos
- **AWS DynamoDB Console**: Verificar que los datos se insertaron
- **Aplicación Web**: Comprobar que los productos aparecen en el catálogo

---

## 🔍 **Daniel Lalanza** (QA & Admin Manager)

### Tu Misión
Testing del sistema completo y gestión administrativa de productos y usuarios.

### Setup Específico
1. **No necesitas AWS CLI** - trabajarás principalmente con la interfaz web
2. **Credenciales de Admin**:
   - Email: [PEDIR CREDENCIALES AL LEAD]
   - Password: [PEDIR CREDENCIALES AL LEAD]
   - Rol: ADMIN (ya configurado)

### Tus Áreas de Testing
```
🎯 Panel de Administración:
   - Crear/editar/eliminar productos
   - Gestionar pedidos
   - Ver estadísticas

🎯 Gestión de Usuarios:
   - Registro de nuevos usuarios
   - Cambio de roles (Customer/Admin)
   - Verificación de permisos

🎯 Flujo de Compra:
   - Añadir productos al carrito
   - Proceso de checkout
   - Gestión de pedidos
```

### URLs de Trabajo
- **Aplicación**: https://dev.dw4alzwzez7pl.amplifyapp.com
- **AWS Cognito Console**: https://console.aws.amazon.com/cognito (para gestión usuarios)
- **AWS DynamoDB Console**: https://console.aws.amazon.com/dynamodb (para ver datos)

### Primeras Tareas Críticas
1. **Login como Admin** y explorar el panel de administración
2. **Crear 3 productos de prueba** usando la interfaz web
3. **Registrar usuario de prueba** y verificar que funciona el flujo completo

### Casos de Prueba Importantes
```
✅ Autenticación:
   - Login correcto/incorrecto
   - Registro de nuevos usuarios
   - Logout y sesiones

✅ Gestión de Productos:
   - Crear producto con todos los campos
   - Editar producto existente
   - Eliminar producto
   - Búsqueda y filtros

✅ Carrito y Pedidos:
   - Añadir/quitar productos del carrito
   - Proceso de checkout completo
   - Ver historial de pedidos
```

---

## ⚙️ **Mario & Jesús** (Backend Team)

### Tu Misión
Desarrollo de funciones Lambda, integración con Stripe y optimización del backend.

### Setup Específico
1. **Usar Sandbox Local** (no necesitáis credenciales específicas aún):
```bash
npx ampx sandbox
```

2. **Esto creará vuestro propio entorno** de desarrollo con todos los recursos AWS

### Vuestras Carpetas Principales
```
amplify/
├── functions/              # 🎯 VUESTRO FOCO PRINCIPAL
│   ├── stripe-webhook/     # Procesamiento pagos
│   ├── shipping-calculator/ # Cálculo envíos
│   └── [nuevas funciones]  # Vuestras funciones
├── data/
│   └── resource.ts         # 🎯 Esquemas GraphQL
└── backend.ts              # 🎯 Configuración principal
```

### Primeras Tareas Críticas
1. **Revisar funciones existentes** en `amplify/functions/`
2. **Entender la lógica de Stripe** en `stripe-webhook/`
3. **Analizar cálculo de envíos** en `shipping-calculator/`

### Desarrollo de Funciones
```bash
# Crear nueva función
mkdir amplify/functions/mi-funcion
cd amplify/functions/mi-funcion

# Estructura básica
npm init -y
npm install @aws-amplify/backend

# Desarrollar en handler.ts
```

### Testing Backend
```bash
npm test                    # Tests completos
npm run test:lambda         # Tests específicos Lambda
```

---

## 📞 **Soporte y Contacto**

### Project Lead
- **Responsabilidades**: Credenciales, configuración, resolución de problemas
- **Contacto**: Slack del proyecto

### Documentación Adicional
- **README.md**: Información general del proyecto
- **docs/TEAM_GUIDE.md**: Guía técnica detallada

### Troubleshooting Común
- **Error AWS credentials**: Verificar `aws configure`
- **Error amplify_outputs.json**: Solicitar archivo actualizado al Lead
- **Error permisos**: Contactar al Lead para verificar roles AWS

---

**Última actualización**: Enero 2026