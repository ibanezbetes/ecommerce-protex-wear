# Admin Dashboard (Next.js)

Este es el panel de administración independiente construido con Next.js 15 y Amplify Gen 2.

## Características

- 🎨 Diseño moderno con Tailwind CSS
- 📊 Dashboard con estadísticas en tiempo real
- 📦 Gestión completa de productos (CRUD)
- 🛒 Gestión de pedidos
- 🔐 Autenticación con AWS Cognito
- 📸 Carga de imágenes a S3
- 🔄 Sincronización en tiempo real con DynamoDB

## Instalación

```bash
cd admin
npm install
```

## Configuración

1. Copia el archivo `amplify_outputs.json` desde el proyecto principal
2. Configura las variables de entorno si es necesario

## Desarrollo

```bash
npm run dev
```

El dashboard estará disponible en `http://localhost:3000`

## Producción

```bash
npm run build
npm start
```

## Nota

Este dashboard comparte el mismo backend de Amplify con el storefront principal (`ecommerce-protex-wear`).
Los cambios en productos y pedidos se reflejan en ambas aplicaciones.
