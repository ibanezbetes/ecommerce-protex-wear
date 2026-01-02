import * as cdk from 'aws-cdk-lib';
import * as lightsail from 'aws-cdk-lib/aws-lightsail';
import { Construct } from 'constructs';

export class ProtexWearInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Generar script de datos de usuario para SWAP y permisos
    const userDataScript = this.generateUserDataScript();

    // Configuración de la instancia Lightsail con WordPress
    const instance = new lightsail.CfnInstance(this, 'ProtexWearInstance', {
      blueprintId: 'wordpress',
      bundleId: 'nano_3_0',
      availabilityZone: 'eu-west-1a',
      instanceName: 'protex-wear-wordpress',
      userData: userDataScript
    });

    // Crear IP estática y asociarla directamente a la instancia
    const staticIp = new lightsail.CfnStaticIp(this, 'ProtexWearStaticIp', {
      staticIpName: 'protex-wear-static-ip',
      attachedTo: instance.instanceName
    });

    // Asegurar que la instancia se crea antes de la IP estática
    staticIp.addDependency(instance);

    // Outputs del stack para información de acceso
    new cdk.CfnOutput(this, 'StaticIpAddress', {
      value: staticIp.attrIpAddress,
      description: 'IP estática para configurar Cloudflare DNS',
      exportName: 'ProtexWear-StaticIP'
    });

    new cdk.CfnOutput(this, 'WordPressUrl', {
      value: `http://${staticIp.attrIpAddress}`,
      description: 'URL de WordPress (usar HTTPS después de configurar Cloudflare)',
      exportName: 'ProtexWear-WordPressURL'
    });

    new cdk.CfnOutput(this, 'SSHCommand', {
      value: `ssh -i tu-clave.pem bitnami@${staticIp.attrIpAddress}`,
      description: 'Comando SSH para acceder a la instancia (reemplazar tu-clave.pem)',
      exportName: 'ProtexWear-SSHCommand'
    });

    new cdk.CfnOutput(this, 'CredentialsCommand', {
      value: `ssh -i tu-clave.pem bitnami@${staticIp.attrIpAddress} "cat /home/bitnami/bitnami_credentials"`,
      description: 'Comando para obtener credenciales de WordPress',
      exportName: 'ProtexWear-CredentialsCommand'
    });

    new cdk.CfnOutput(this, 'NextSteps', {
      value: `1. Configurar DNS en Cloudflare: A @ -> ${staticIp.attrIpAddress} | 2. Obtener credenciales WordPress | 3. Acceder vía SSH para configuración adicional`,
      description: 'Próximos pasos después del despliegue',
      exportName: 'ProtexWear-NextSteps'
    });
  }

  /**
   * Genera el script de datos de usuario para configuración automática
   * Incluye: SWAP de 2GB + permisos Bitnami + logging
   */
  private generateUserDataScript(): string {
    return `#!/bin/bash

# Protex Wear Infrastructure - User Data Script
# Configuración automática: SWAP + Permisos Bitnami
# Fecha: $(date)

# Función de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a /var/log/protex-wear-setup.log
}

log "=== INICIO: Configuración Protex Wear ==="

# 1. CONFIGURACIÓN SWAP (2GB) - CRÍTICO para evitar OOM kills
log "Configurando SWAP de 2GB para prevenir OOM durante importación masiva..."

# Verificar si ya existe SWAP
if swapon --show | grep -q "/swapfile"; then
    log "SWAP ya existe, omitiendo creación"
else
    log "Creando archivo SWAP de 2GB..."
    fallocate -l 2G /swapfile
    
    if [ $? -eq 0 ]; then
        log "Archivo SWAP creado exitosamente"
        
        # Configurar permisos de seguridad
        chmod 600 /swapfile
        log "Permisos SWAP configurados (600)"
        
        # Formatear como SWAP
        mkswap /swapfile
        log "Archivo formateado como SWAP"
        
        # Activar SWAP
        swapon /swapfile
        log "SWAP activado"
        
        # Hacer permanente en /etc/fstab
        if ! grep -q "/swapfile" /etc/fstab; then
            echo '/swapfile none swap sw 0 0' >> /etc/fstab
            log "SWAP añadido a /etc/fstab para persistencia"
        fi
        
        # Verificar SWAP activo
        SWAP_SIZE=$(swapon --show --noheadings | awk '{print $3}')
        log "SWAP configurado correctamente: $SWAP_SIZE"
    else
        log "ERROR: Falló la creación del archivo SWAP"
    fi
fi

# 2. CONFIGURACIÓN PERMISOS BITNAMI - Mejores prácticas
log "Configurando permisos Bitnami para wp-content..."

if [ -d "/opt/bitnami/wordpress/wp-content" ]; then
    # Establecer propietario correcto
    chown -R bitnami:daemon /opt/bitnami/wordpress/wp-content
    log "Propietario configurado: bitnami:daemon"
    
    # Dar permisos de escritura al grupo
    chmod -R g+w /opt/bitnami/wordpress/wp-content
    log "Permisos de grupo configurados: g+w"
    
    # Verificar permisos
    PERMS=$(ls -la /opt/bitnami/wordpress/ | grep wp-content)
    log "Permisos wp-content: $PERMS"
else
    log "ADVERTENCIA: Directorio wp-content no encontrado, se configurará después"
fi

# 3. VERIFICACIÓN FINAL
log "=== VERIFICACIÓN FINAL ==="

# Verificar memoria total (RAM + SWAP)
TOTAL_MEM=$(free -h | grep "Mem:" | awk '{print $2}')
TOTAL_SWAP=$(free -h | grep "Swap:" | awk '{print $2}')
log "Memoria RAM: $TOTAL_MEM"
log "Memoria SWAP: $TOTAL_SWAP"

# Verificar servicios Bitnami
if systemctl is-active --quiet apache; then
    log "Servicio Apache: ACTIVO"
elif systemctl is-active --quiet nginx; then
    log "Servicio Nginx: ACTIVO"
else
    log "ADVERTENCIA: Servicios web no detectados aún"
fi

log "=== FIN: Configuración Protex Wear completada ==="
log "Logs disponibles en: /var/log/protex-wear-setup.log"

# Señal de finalización exitosa
touch /tmp/protex-wear-setup-complete
log "Archivo de señal creado: /tmp/protex-wear-setup-complete"
`;
  }
}