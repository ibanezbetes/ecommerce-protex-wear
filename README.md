# 🛡️ Protex Wear — E-commerce B2B/B2C

Portal de venta de Equipos de Protección Individual (EPIs) para empresas y particulares. Gestión de catálogo, carrito, checkout con múltiples métodos de pago, y panel de administración.

---

## 🚀 Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Estilos** | [Tailwind CSS 4](https://tailwindcss.com/) + CSS Custom Properties |
| **Estado** | [Zustand](https://github.com/pmndrs/zustand) |
| **Backend (API)** | [AWS AppSync](https://aws.amazon.com/appsync/) (GraphQL) |
| **Auth** | [AWS Cognito](https://aws.amazon.com/cognito/) (User Pools) |
| **Pagos** | [Stripe](https://stripe.com/) (Checkout Sessions + Webhooks) |
| **Base de Datos** | [Amazon DynamoDB](https://aws.amazon.com/dynamodb/) |
| **IaC** | [AWS CDK](https://aws.amazon.com/cdk/) (en `/infrastructure`) |

---

## 📁 Estructura del Proyecto

```
├── src/
│   ├── app/                        # Rutas de Next.js (App Router)
│   │   ├── page.tsx                # Página principal (Home)
│   │   ├── layout.tsx              # Layout raíz (Navbar + Footer + CartDrawer)
│   │   ├── globals.css             # Sistema de diseño (variables CSS + estilos base)
│   │   ├── productos/              # Catálogo de productos con filtros por marca
│   │   ├── products/[id]/          # Detalle de producto con selector de variantes
│   │   ├── sobre-nosotros/         # Página "Sobre Nosotros"
│   │   ├── contacto/               # Formulario de contacto
│   │   ├── login/                  # Inicio de sesión (Cognito)
│   │   ├── register/               # Registro de usuario (Cognito)
│   │   ├── confirm/                # Confirmación de email (OTP)
│   │   ├── checkout/               # Proceso de compra
│   │   ├── admin/                  # Panel de administración
│   │   │   ├── page.tsx            # Dashboard
│   │   │   ├── layout.tsx          # Layout del admin (sidebar)
│   │   │   ├── productos/          # CRUD de productos
│   │   │   ├── pedidos/            # Gestión de pedidos
│   │   │   ├── reportes/           # Reportes y métricas
│   │   │   └── testing/            # Zona de testeo
│   │   └── api/
│   │       ├── checkout/route.ts   # Creación de Stripe Checkout Sessions
│   │       └── webhook/route.ts    # Webhook de Stripe para confirmar pagos
│   ├── components/
│   │   ├── layout/                 # Componentes de layout global
│   │   │   ├── Navbar.tsx          # Barra de navegación
│   │   │   ├── Footer.tsx          # Pie de página
│   │   │   └── CartDrawer.tsx      # Drawer lateral del carrito
│   │   └── checkout/               # Componentes del flujo de pago
│   │       ├── PaymentMethodSelector.tsx
│   │       ├── BankTransferDetails.tsx
│   │       └── BizumDetails.tsx
│   ├── services/
│   │   └── graphqlClient.ts        # Cliente unificado de GraphQL (auth híbrida)
│   ├── store/
│   │   ├── useAuth.ts              # Estado global de autenticación
│   │   └── useCart.ts              # Estado global del carrito
│   └── lib/
│       └── config.ts               # Datos de negocio (banco, contacto, etc.)
├── public/
│   ├── logo.png                    # Logo de Protex Wear
│   └── images/                     # Imágenes estáticas (hero, marcas, etc.)
├── infrastructure/                 # Infraestructura como Código (AWS CDK + Amplify)
│   ├── amplify/                    # Definición del backend de Amplify Gen 2
│   ├── graphql/                    # Esquemas GraphQL
│   ├── lambda/                     # Funciones Lambda
│   └── lib/                        # Stacks de CDK
├── migration/                      # Scripts de migración de datos a DynamoDB
├── docs/                           # Documentación del equipo
├── excels/                         # Fuentes de datos de proveedores
├── .env.local.example              # Plantilla de variables de entorno
├── package.json                    # Dependencias y scripts
├── tsconfig.json                   # Configuración de TypeScript
└── next.config.ts                  # Configuración de Next.js
```

---

## ⚡ Instalación y Ejecución

### Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior
- [npm](https://www.npmjs.com/) v9 o superior

### 1. Clonar e Instalar

```bash
git clone https://github.com/ibanezbetes/ecommerce-protex-wear.git
cd ecommerce-protex-wear
npm install
```

### 2. Configurar Variables de Entorno

Copia la plantilla y rellena los valores:

```bash
cp .env.local.example .env.local
```

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_APPSYNC_URL` | URL del endpoint de AWS AppSync (GraphQL) |
| `NEXT_PUBLIC_APPSYNC_API_KEY` | API Key pública para acceso de invitados |
| `NEXT_PUBLIC_USER_POOL_CLIENT_ID` | Client ID del User Pool de Cognito |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clave pública de Stripe |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe (solo servidor) |
| `STRIPE_WEBHOOK_SECRET` | Secreto del webhook de Stripe |
| `NEXT_PUBLIC_BASE_URL` | URL base de la aplicación (e.g., `http://localhost:3000`) |

### 3. Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### 4. Build de Producción

```bash
npm run build
npm start
```

---

## 🔐 Autenticación

El sistema usa **AWS Cognito** con el flujo `USER_PASSWORD_AUTH`:

1. **Registro** → El usuario se registra desde `/register`. Cognito envía un código OTP al email.
2. **Confirmación** → El usuario introduce el código en `/confirm`.
3. **Login** → El usuario introduce email + contraseña en `/login`. Se obtiene un JWT (IdToken).
4. **Sesión** → El JWT se almacena en el store de Zustand (`useAuth`) y se envía automáticamente en cada petición GraphQL.

---

## 💳 Métodos de Pago

| Método | Estado |
|---|---|
| **Stripe** (tarjeta, etc.) | ✅ Integrado (Checkout Sessions) |
| **Transferencia Bancaria** | ✅ Instrucciones mostradas al cliente |
| **Bizum** | ✅ Instrucciones mostradas al cliente |
| **Pago Diferido (B2B)** | ✅ Disponible para usuarios con permiso `can_pay_later` |

---

## 🛠️ Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo (Turbopack) |
| `npm run build` | Build de producción |
| `npm start` | Servidor de producción |
| `npm run lint` | Linter (ESLint) |

---

## 📄 Licencia

Proyecto privado. Todos los derechos reservados — Protex Wear S.L.
