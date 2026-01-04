# Guía de Verificación de Build Artifacts

## Objetivo

Asegurar que el proceso de build en Amplify Console preserve correctamente los archivos de configuración manual y que `amplify-setup.ts` se incluya en el bundle final.

## Pre-Deployment Checklist

### 1. Verificación Local Pre-Build

Antes de hacer push al repositorio, verificar localmente:

```bash
# 1. Verificar que amplify-setup.ts existe
ls -la src/amplify-setup.ts

# 2. Verificar contenido del archivo
head -20 src/amplify-setup.ts

# 3. Verificar que main.tsx importa amplify-setup primero
head -10 src/main.tsx

# 4. Ejecutar build local
npm run build

# 5. Verificar que el build es exitoso
echo $?  # Debe retornar 0
```

### 2. Verificación de Estructura de Archivos

```bash
# Verificar estructura de archivos críticos
find src -name "*.ts" -o -name "*.tsx" | grep -E "(main|amplify-setup)"

# Resultado esperado:
# src/amplify-setup.ts
# src/main.tsx
```

### 3. Verificación de Contenido

```bash
# Verificar que main.tsx NO contiene configuración de Amplify
grep -n "Amplify.configure" src/main.tsx
# Debe retornar: (sin resultados)

# Verificar que amplify-setup.ts SÍ contiene configuración
grep -n "Amplify.configure" src/amplify-setup.ts
# Debe retornar: línea con Amplify.configure(

# Verificar orden de imports en main.tsx
head -5 src/main.tsx | grep -n "import"
# Primera línea de import debe ser: import './amplify-setup';
```

## Post-Deployment Verification

### 1. Verificación en Amplify Console

#### Acceder a Build Logs
1. Ir a **AWS Amplify Console**
2. Seleccionar la aplicación **Protex Wear**
3. Ir a **Build settings** → **Build history**
4. Seleccionar el último build
5. Revisar los logs de build

#### Comandos de Verificación en Build Logs

Buscar estas líneas en los logs:

```bash
# Build phase - debe mostrar archivos procesados
✓ 889 modules transformed.

# Verificar que no hay errores relacionados con amplify-setup
# No debe aparecer: "Module not found: amplify-setup"
# No debe aparecer: "Cannot resolve './amplify-setup'"
```

### 2. Verificación de Bundle Final

#### Descargar y Inspeccionar Bundle

```bash
# Descargar el bundle desde CloudFront (opcional)
curl -o bundle.js https://tu-dominio.amplifyapp.com/assets/index-[hash].js

# Verificar que el bundle contiene referencias a Amplify
grep -i "amplify" bundle.js | head -5

# Verificar que contiene configuración de auth
grep -i "user_pool_id" bundle.js | head -1
```

#### Verificación via DevTools del Navegador

1. **Abrir la aplicación** en el navegador
2. **Abrir DevTools** (F12)
3. **Ir a Network tab**
4. **Recargar la página**
5. **Verificar que se cargan los archivos**:
   - `index.html` (200 OK)
   - `index-[hash].js` (200 OK)
   - `index-[hash].css` (200 OK)

### 3. Verificación Funcional

#### Test de Configuración de Amplify

```javascript
// Ejecutar en Console del navegador
console.log('Amplify Config:', window.AWS?.Amplify?.configure || 'No disponible');

// Verificar que Auth está configurado
console.log('Auth Config:', window.AWS?.Amplify?.Auth?.configure || 'No disponible');
```

#### Test de Rutas SPA

```bash
# Verificar que las rutas SPA funcionan (después de configurar CloudFront)
curl -I https://tu-dominio.amplifyapp.com/login
curl -I https://tu-dominio.amplifyapp.com/dashboard
curl -I https://tu-dominio.amplifyapp.com/products

# Todas deben retornar: HTTP/2 200
```

## Comandos de Verificación Automatizada

### Script de Verificación Local

```bash
#!/bin/bash
# verify-build.sh

echo "🔍 Verificando configuración de Amplify..."

# 1. Verificar archivos existen
if [ ! -f "src/amplify-setup.ts" ]; then
    echo "❌ ERROR: src/amplify-setup.ts no existe"
    exit 1
fi

if [ ! -f "src/main.tsx" ]; then
    echo "❌ ERROR: src/main.tsx no existe"
    exit 1
fi

# 2. Verificar contenido
if ! grep -q "import './amplify-setup'" src/main.tsx; then
    echo "❌ ERROR: main.tsx no importa amplify-setup"
    exit 1
fi

if grep -q "Amplify.configure" src/main.tsx; then
    echo "❌ ERROR: main.tsx contiene Amplify.configure (debe estar en amplify-setup.ts)"
    exit 1
fi

if ! grep -q "Amplify.configure" src/amplify-setup.ts; then
    echo "❌ ERROR: amplify-setup.ts no contiene Amplify.configure"
    exit 1
fi

# 3. Verificar build
echo "🔨 Ejecutando build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ ERROR: Build falló"
    exit 1
fi

# 4. Verificar bundle
if [ ! -f "dist/index.html" ]; then
    echo "❌ ERROR: dist/index.html no existe"
    exit 1
fi

echo "✅ Todas las verificaciones pasaron"
echo "📦 Build artifacts están correctos"
echo "🚀 Listo para deployment"
```

### Script de Verificación Post-Deployment

```bash
#!/bin/bash
# verify-deployment.sh

DOMAIN="$1"
if [ -z "$DOMAIN" ]; then
    echo "Uso: $0 <dominio-amplify>"
    echo "Ejemplo: $0 https://main.d1234567890.amplifyapp.com"
    exit 1
fi

echo "🌐 Verificando deployment en: $DOMAIN"

# 1. Verificar que la aplicación carga
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN")
if [ "$HTTP_CODE" != "200" ]; then
    echo "❌ ERROR: Aplicación no carga (HTTP $HTTP_CODE)"
    exit 1
fi

# 2. Verificar rutas SPA
for route in "/login" "/dashboard" "/products"; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN$route")
    if [ "$HTTP_CODE" != "200" ]; then
        echo "❌ ERROR: Ruta $route no funciona (HTTP $HTTP_CODE)"
        exit 1
    fi
done

# 3. Verificar archivos estáticos
for file in "/assets/index-*.js" "/assets/index-*.css"; do
    # Nota: Esto requiere conocer el hash exacto del archivo
    echo "ℹ️  Verificar manualmente: $DOMAIN$file"
done

echo "✅ Deployment verificado correctamente"
echo "🎉 Aplicación funcionando en producción"
```

## Troubleshooting

### Problema: amplify-setup.ts no se incluye en el bundle

**Síntomas:**
- Error "Auth UserPool not configured" en producción
- Build exitoso pero aplicación falla al cargar

**Solución:**
```bash
# 1. Verificar que el import existe y es correcto
grep -n "import.*amplify-setup" src/main.tsx

# 2. Verificar que no hay errores de TypeScript
npx tsc --noEmit

# 3. Limpiar cache y rebuild
rm -rf node_modules/.cache
rm -rf dist
npm run build
```

### Problema: Configuración sobrescrita durante build

**Síntomas:**
- Configuración diferente en producción vs local
- Variables de entorno no aplicadas

**Solución:**
```bash
# 1. Verificar que la configuración es hardcoded
grep -A 10 "Amplify.configure" src/amplify-setup.ts

# 2. Verificar que no hay imports de archivos de configuración
grep -n "import.*config" src/amplify-setup.ts

# 3. Asegurar que no hay variables de entorno en amplify-setup.ts
grep -n "process.env" src/amplify-setup.ts
# No debe retornar resultados
```

### Problema: Build falla después de los cambios

**Síntomas:**
- Error de build en Amplify Console
- Módulos no encontrados

**Solución:**
```bash
# 1. Verificar sintaxis de TypeScript
npx tsc --noEmit src/amplify-setup.ts
npx tsc --noEmit src/main.tsx

# 2. Verificar imports
npm run build 2>&1 | grep -i "module not found"

# 3. Verificar que todos los archivos están committeados
git status
git add src/amplify-setup.ts
git commit -m "Add amplify-setup.ts"
```

## Checklist Final

Antes de considerar el deployment completo:

- [ ] ✅ `src/amplify-setup.ts` existe y contiene configuración completa
- [ ] ✅ `src/main.tsx` importa `./amplify-setup` como primera línea
- [ ] ✅ `src/main.tsx` NO contiene `Amplify.configure`
- [ ] ✅ Build local exitoso (`npm run build`)
- [ ] ✅ Tests pasan (`npm test -- amplify-setup main-import-order`)
- [ ] ✅ Bundle generado en `dist/`
- [ ] ✅ Aplicación carga en producción (HTTP 200)
- [ ] ✅ Rutas SPA funcionan (después de configurar CloudFront)
- [ ] ✅ No hay errores "Auth UserPool not configured"
- [ ] ✅ AuthContext se inicializa correctamente

## Referencias

- [Amplify Build Settings](https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html)
- [Vite Build Configuration](https://vitejs.dev/guide/build.html)
- [JavaScript Module Loading](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)