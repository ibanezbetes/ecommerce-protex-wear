# Infraestructura Protex Wear

Infraestructura AWS CDK para la Plataforma E-commerce de Protex Wear

## Descripción General

Este proyecto CDK crea una infraestructura optimizada en costes (~$5-10 USD/mes) para la plataforma e-commerce de Protex Wear usando:

- **Instancia AWS Lightsail** con WordPress/WooCommerce (imagen Bitnami)
- **IP estática** para integración con Cloudflare
- **Configuración automática de SWAP** para optimización de memoria
- **Configuración adecuada de permisos** Bitnami

## Estado Actual de Implementación

### ✅ Completado
- **Estructura del proyecto CDK** con TypeScript
- **Instancia Lightsail** configurada con:
  - Blueprint: `wordpress` (imagen Bitnami certificada)
  - Bundle: `nano_3_0` (1GB RAM, $5/mes)
  - Zona de disponibilidad: `eu-west-1a`
  - Nombre: `protex-wear-wordpress`
- **IP estática** implementada:
  - Nombre: `protex-wear-static-ip`
  - Asociada automáticamente a la instancia
  - Dependencias correctas para orden de creación
- **Script de datos de usuario** (CRÍTICO):
  - ✅ SWAP de 2GB para prevenir OOM kills durante importación masiva
  - ✅ Permisos Bitnami correctos para wp-content
  - ✅ Logging completo para debugging
  - ✅ Verificaciones automáticas de configuración
  - ✅ Manejo de errores y casos edge
- **Outputs del stack** implementados:
  - ✅ IP estática para configuración Cloudflare DNS
  - ✅ URL de WordPress para verificación
  - ✅ Comando SSH listo para usar
  - ✅ Comando para obtener credenciales Bitnami
  - ✅ Instrucciones de próximos pasos
- **Tests de propiedades** implementados:
  - ✅ Configuración correcta de la instancia Lightsail
  - ✅ Uso del blueprint WordPress
  - ✅ Bundle nano_3_0 para optimización de costes
  - ✅ Zona de disponibilidad europea
  - ✅ Única instancia creada
  - ✅ IP estática creada y asociada correctamente
  - ✅ Nombre de IP para integración Cloudflare
  - ✅ Dependencias correctas de creación
  - ✅ Script SWAP con todos los comandos críticos
  - ✅ Permisos de seguridad y persistencia SWAP
  - ✅ Prevención OOM kills validada
  - ✅ Permisos Bitnami correctos para wp-content
  - ✅ Propietario y grupo configurados correctamente
  - ✅ Verificación post-configuración implementada

### 🚧 En Progreso
- Tests de propiedades para outputs del stack

## Prerrequisitos

- Node.js 18+ y npm
- AWS CLI configurado con credenciales apropiadas
- AWS CDK CLI instalado globalmente: `npm install -g aws-cdk`

## Inicio Rápido

```bash
# Instalar dependencias
npm install

# Bootstrap CDK (solo la primera vez)
cdk bootstrap

# Desplegar infraestructura
npm run deploy

# Ver diferencias antes del despliegue
npm run diff

# Destruir infraestructura
npm run destroy
```

## Estructura del Proyecto

```
infra/
├── bin/                    # Punto de entrada de la aplicación CDK
├── lib/                    # Definiciones de stacks
├── test/                   # Tests unitarios
├── cdk.json               # Configuración CDK
├── tsconfig.json          # Configuración TypeScript
└── package.json           # Dependencias y scripts
```

## Testing

### Tests Implementados
El proyecto incluye tests automatizados que verifican:

**Instancia Lightsail:**
- **Configuración de la instancia Lightsail**: Valida blueprint, bundle y zona AZ
- **Optimización de costes**: Confirma uso del bundle nano_3_0 ($5/mes)
- **Configuración regional**: Verifica zona eu-west-1a para latencia europea
- **Unicidad de recursos**: Asegura que solo se crea una instancia

**IP Estática:**
- **Creación y asociación**: Valida que la IP se crea y asocia correctamente
- **Nombre para Cloudflare**: Confirma nombre `protex-wear-static-ip`
- **Asociación correcta**: Verifica que se asocia a `protex-wear-wordpress`
- **Unicidad de IP**: Asegura que solo se crea una IP estática
- **Dependencias**: Valida orden correcto de creación (instancia → IP)

**Script de Datos de Usuario (SWAP):**
- **Comando de creación SWAP**: Verifica `fallocate -l 2G /swapfile`
- **Permisos de seguridad**: Confirma `chmod 600 /swapfile`
- **Formateo SWAP**: Valida `mkswap /swapfile`
- **Activación SWAP**: Verifica `swapon /swapfile`
- **Persistencia**: Confirma configuración en `/etc/fstab`
- **Prevención OOM**: Valida logging de prevención OOM kills
- **Shebang bash**: Verifica inicio correcto del script

**Permisos Bitnami:**
- **Propietario correcto**: Verifica `chown -R bitnami:daemon`
- **Permisos de grupo**: Confirma `chmod -R g+w` para wp-content
- **Verificación directorio**: Valida existencia de wp-content
- **Logging Bitnami**: Confirma logging de configuración
- **Verificación post-config**: Valida `ls -la` después de configurar

### Ejecutar Tests
```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con detalles
npm test -- --verbose

# Ejecutar tests en modo watch
npm run test:watch
```

## Scripts Disponibles

- `npm run build` - Compilar TypeScript
- `npm run test` - Ejecutar tests unitarios
- `npm run deploy` - Desplegar a AWS
- `npm run destroy` - Destruir recursos AWS
- `npm run diff` - Mostrar diferencias de despliegue
- `npm run synth` - Sintetizar template CloudFormation

## Configuración

La infraestructura está configurada para:
- **Región**: eu-west-1 (Irlanda)
- **Zona de disponibilidad**: eu-west-1a
- **Tipo de instancia**: nano_3_0 (1GB RAM, $5/mes)
- **Blueprint**: wordpress (Bitnami certificado)

## Especificaciones Técnicas

### Instancia Lightsail
- **Imagen**: WordPress con Bitnami (incluye Nginx + PHP-FPM + MySQL)
- **Memoria**: 1GB RAM con configuración automática de SWAP de 2GB
- **Almacenamiento**: SSD incluido en el bundle
- **Coste**: ~$5 USD/mes

### Configuración Automática SWAP
- **Memoria virtual**: 2GB SWAP para complementar 1GB RAM
- **Prevención OOM**: Evita crashes durante importación masiva de productos
- **Persistencia**: Configuración permanente en /etc/fstab
- **Logging**: Logs detallados en `/var/log/protex-wear-setup.log`
- **Verificación**: Archivo de señal `/tmp/protex-wear-setup-complete`

### Configuración de Red
- IP estática dedicada para DNS permanente
- Integración preparada para Cloudflare CDN
- Puertos estándar HTTP/HTTPS abiertos

## Post-Despliegue

Después del despliegue exitoso, el stack proporcionará los siguientes outputs:

### Información de Acceso
- **IP Estática**: Dirección IP fija para configurar Cloudflare DNS
- **URL WordPress**: Acceso directo a la instalación WordPress
- **Comando SSH**: Comando completo para conectar a la instancia
- **Comando Credenciales**: Obtener usuario y contraseña de WordPress

### Próximos Pasos Automáticos
1. **Configurar DNS en Cloudflare** usando la IP estática proporcionada
2. **Obtener credenciales WordPress** usando el comando SSH proporcionado
3. **Acceder vía SSH** para configuración adicional si es necesaria

### Comandos de Ejemplo
```bash
# Después del despliegue, usar los outputs del stack:
cdk deploy  # Mostrará todos los outputs al final

# Ejemplo de outputs:
# StaticIpAddress = 35.150.20.10
# SSHCommand = ssh -i tu-clave.pem bitnami@35.150.20.10
# CredentialsCommand = ssh -i tu-clave.pem bitnami@35.150.20.10 "cat /home/bitnami/bitnami_credentials"
```

## Verificación del Sistema

### Comandos de Diagnóstico
```bash
# Verificar estado del SWAP
swapon --show
free -h

# Verificar permisos Bitnami
ls -la /opt/bitnami/wordpress/wp-content/

# Ver logs de inicialización
sudo tail -f /var/log/cloud-init-output.log
```

## Solución de Problemas

Consulta la documentación de despliegue para problemas comunes y soluciones.

## Equipo de Desarrollo

- **Daniel Jesús Ibáñez Betés** — Arquitecto del Sistema y Coordinador
- **Kiro** — Infraestructura como Código (CDK) y despliegue inicial