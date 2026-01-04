# Configuración de Rutas SPA en Amplify Hosting

## Problema

La navegación directa a rutas como `/login`, `/dashboard`, `/products` falla con error 404 porque Amplify Hosting/CloudFront no tiene configuradas las reglas de reescritura para Single Page Applications (SPA).

## Solución

Configurar reglas de reescritura en Amplify Console para que todas las rutas que no sean archivos estáticos redirijan a `index.html`.

## Configuración en Amplify Console

### Paso 1: Acceder a Rewrites and Redirects

1. Ir a **AWS Amplify Console**
2. Seleccionar la aplicación **Protex Wear**
3. En el menú lateral, ir a **App settings** → **Rewrites and redirects**

### Paso 2: Añadir Regla de Reescritura SPA

Hacer clic en **"Add rewrite and redirect"** y configurar:

```
Source address:
</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|map|json)$)([^.]+$)/>

Target address:
/index.html

Type:
200 (Rewrite)
```

### Explicación del Patrón Regex

El patrón regex `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|map|json)$)([^.]+$)/>` funciona así:

- `^[^.]+$` - Coincide con rutas que NO contienen puntos (ej: `/login`, `/dashboard`)
- `|` - Operador OR
- `\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|map|json)$)([^.]+$)` - Coincide con rutas que tienen punto pero NO terminan en extensiones de archivos estáticos

**Archivos estáticos excluidos:**
- `.css` - Hojas de estilo
- `.gif`, `.ico`, `.jpg`, `.png`, `.svg` - Imágenes
- `.js` - JavaScript
- `.txt` - Archivos de texto
- `.woff`, `.ttf` - Fuentes
- `.map` - Source maps
- `.json` - Archivos JSON

## Configuración Alternativa (Más Simple)

Si el patrón regex complejo causa problemas, usar esta configuración más simple:

```
Source address:
</^(?!.*\.).*$/>

Target address:
/index.html

Type:
200 (Rewrite)
```

Este patrón más simple coincide con cualquier ruta que NO contenga un punto.

## Verificación

Después de aplicar la configuración:

1. **Esperar 2-3 minutos** para que CloudFront propague los cambios
2. **Probar navegación directa** a:
   - `https://tu-dominio.amplifyapp.com/login`
   - `https://tu-dominio.amplifyapp.com/dashboard`
   - `https://tu-dominio.amplifyapp.com/products`

3. **Verificar que archivos estáticos funcionan**:
   - CSS se carga correctamente
   - Imágenes se muestran
   - JavaScript se ejecuta

## Configuración Manual en amplify.yml (Alternativa)

Si prefieres configurar via código, añadir a `amplify.yml`:

```yaml
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
  customHeaders:
    - pattern: '**/*'
      headers:
        - key: 'Strict-Transport-Security'
          value: 'max-age=31536000; includeSubDomains'
        - key: 'X-Frame-Options'
          value: 'DENY'
  rewrites:
    - source: '</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|map|json)$)([^.]+$)/>'
      target: '/index.html'
      status: '200'
```

## Troubleshooting

### Si las rutas siguen fallando:

1. **Verificar que la regla está activa** en Amplify Console
2. **Limpiar caché de CloudFront** (puede tomar hasta 15 minutos)
3. **Probar en ventana incógnito** para evitar caché del navegador
4. **Verificar que el patrón regex es correcto** (sin espacios extra)

### Si los archivos estáticos no cargan:

1. **Revisar el patrón regex** - asegurar que excluye las extensiones correctas
2. **Verificar que los archivos existen** en el directorio `dist/`
3. **Comprobar la configuración de Vite** en `vite.config.ts`

## Comandos de Verificación Local

Para probar localmente que las rutas funcionan:

```bash
# Servir build localmente
npm run build
npx serve dist

# Probar rutas directas
curl -I http://localhost:3000/login
curl -I http://localhost:3000/dashboard
```

## Referencias

- [Amplify Hosting Redirects Documentation](https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html)
- [CloudFront Behaviors Documentation](https://docs.aws.amazon.com/cloudfront/latest/developerguide/distribution-web-values-specify.html#DownloadDistValuesBehaviors)
- [SPA Routing Best Practices](https://create-react-app.dev/docs/deployment/#serving-apps-with-client-side-routing)