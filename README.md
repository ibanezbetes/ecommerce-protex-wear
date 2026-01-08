# Protex Wear - E-commerce Platform

Plataforma de comercio electrónico especializada en equipos de protección individual (EPI) y ropa de trabajo profesional, desarrollada con tecnologías modernas y arquitectura serverless.

## 🚀 Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: AWS Amplify Gen 2 (GraphQL + DynamoDB)
- **Autenticación**: AWS Cognito
- **Almacenamiento**: AWS S3
- **Despliegue**: AWS Amplify Hosting
- **Estilos**: CSS Modules + Variables CSS

## 📋 Prerrequisitos

- **Node.js**: v18.0.0 o superior ([Descargar](https://nodejs.org/))
- **npm**: v8.0.0 o superior (incluido con Node.js)
- **AWS CLI**: Configurado con credenciales ([Guía de instalación](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html))
- **Amplify CLI**: `npm install -g @aws-amplify/cli`

## ⚡ Instalación Rápida

### 1. Clonar el repositorio
```bash
git clone https://github.com/ibanezbetes/ecommerce-protex-wear.git
cd ecommerce-protex-wear
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Amplify (CRÍTICO)

**Opción A: Sandbox Local (Recomendado para desarrollo)**
```bash
npx ampx sandbox
```
Esto generará automáticamente `amplify_outputs.json` con tu entorno local.

**Opción B: Usar entorno existente**
1. Solicita el archivo `amplify_outputs.json` al Project Lead
2. Colócalo en la raíz del proyecto
3. **NO** lo subas a Git (ya está en `.gitignore`)

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes React reutilizables
├── contexts/           # Context providers (Auth, etc.)
├── hooks/              # Custom hooks (useProducts, useAuth, etc.)
├── pages/              # Páginas principales de la aplicación
├── services/           # Servicios de API (GraphQL operations)
├── types/              # Definiciones de TypeScript
├── lib/                # Utilidades y configuraciones
└── amplify-setup.ts    # Configuración de Amplify

amplify/
├── data/               # Esquema GraphQL y modelos de datos
├── auth/               # Configuración de autenticación
├── storage/            # Configuración de almacenamiento S3
└── functions/          # Funciones Lambda (si las hay)
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linter ESLint
npm run type-check   # Verificación de tipos TypeScript
```

## 🌐 Entornos

- **Desarrollo**: `http://localhost:3000`
- **Producción**: `https://dev.dw4alzwzez7pl.amplifyapp.com`

## 📚 Documentación Adicional

- [Guía del Equipo](./docs/TEAM_GUIDE.md) - Instrucciones detalladas por rol
- [Próximos Pasos](./docs/NEXT_STEPS.md) - Roadmap y tareas pendientes
- [Gestión de Productos](./docs/PRODUCT_MANAGEMENT.md) - Administración del catálogo

## 🔐 Seguridad

- Las credenciales AWS están en variables de entorno
- `amplify_outputs.json` contiene configuración sensible y NO debe subirse a Git
- Usa siempre HTTPS en producción
- Las API keys están restringidas por dominio

## 🤝 Contribución

1. Crea una rama desde `dev`: `git checkout -b feature/nueva-funcionalidad`
2. Realiza tus cambios y commits
3. Push a tu rama: `git push origin feature/nueva-funcionalidad`
4. Crea un Pull Request hacia `dev`

## 📞 Soporte

Para problemas técnicos o preguntas sobre el setup, contacta al Project Lead o revisa la [Guía del Equipo](./docs/TEAM_GUIDE.md).

---

**Última actualización**: Enero 2026