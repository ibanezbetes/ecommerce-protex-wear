# 🛠️ Amplify Data Manager - Setup Inmediato

**Fecha**: 4 de Enero 2026  
**Prioridad**: ALTA - Bloqueante para Lalanza  
**Responsable**: Ibañez  

---

## 🎯 OBJETIVO

Habilitar el **Amplify Data Manager nativo** para que Lalanza pueda gestionar productos, pedidos y usuarios sin necesidad de código.

---

## 📋 PASOS PARA HABILITAR

### 1. **Acceder a Amplify Console**
```
URL: https://eu-west-1.console.aws.amazon.com/amplify/
```

### 2. **Seleccionar la App**
- Buscar: `protexwearserverless` o similar
- Debe mostrar el stack: `amplify-protexwearserverless-daniz-sandbox-cf68dd4f5f`

### 3. **Habilitar Data Manager**
1. **Sidebar izquierdo** → **Data**
2. **Data Manager** tab
3. **Enable Data Manager** (botón azul)
4. **Configurar acceso**:
   ```
   Admin users: lalanza@protexwear.com
   Permissions: Full access to all models
   ```

### 4. **Configurar Modelos**
El Data Manager debe detectar automáticamente:
- ✅ **Product** (con todos los campos)
- ✅ **Order** (con estados y relaciones)
- ✅ **User** (con roles y permisos)

### 5. **Obtener URL**
Una vez habilitado:
```
URL típica: https://[app-id].amplifyapp.com/data-manager
```

---

## 🔐 CONFIGURACIÓN DE ACCESO

### Usuario Admin (Lalanza)
```
Email: lalanza@protexwear.com
Password: TempAdmin123!
Rol: ADMIN (grupo Cognito)
```

### Permisos Requeridos
- **Products**: Create, Read, Update, Delete
- **Orders**: Create, Read, Update, Delete  
- **Users**: Read, Update (no Delete por seguridad)

---

## ✅ VERIFICACIÓN

### Checklist de Funcionalidad:
- [ ] Data Manager URL accesible
- [ ] Login con credenciales admin funciona
- [ ] Puede ver lista de productos
- [ ] Puede crear nuevo producto
- [ ] Puede editar producto existente
- [ ] Puede ver lista de pedidos
- [ ] Puede cambiar estado de pedido
- [ ] Puede ver lista de usuarios
- [ ] Interfaz responsive (móvil/tablet)

### Test de Productos:
1. **Crear producto de prueba**:
   ```
   SKU: TEST-001
   Name: Producto Test
   Price: 29.99
   Stock: 100
   Category: Test
   ```
2. **Verificar en GraphQL** que aparece
3. **Editar desde Data Manager**
4. **Verificar cambios**

---

## 🆘 TROUBLESHOOTING

### Error: "Data Manager not available"
**Causa**: App no desplegada correctamente  
**Solución**: Verificar que `npm run dev` está ejecutándose

### Error: "Access denied"
**Causa**: Usuario no en grupo ADMIN  
**Solución**: Verificar asignación de grupo en Cognito

### Error: "Models not found"
**Causa**: Schema no sincronizado  
**Solución**: Re-desplegar sandbox (`npm run dev`)

### Error: "URL not working"
**Causa**: Data Manager no habilitado correctamente  
**Solución**: Repetir pasos de habilitación

---

## 📤 INFORMACIÓN PARA LALANZA

### URLs de Trabajo:
```
Data Manager: [GENERAR TRAS SETUP]
AWS Console: https://eu-west-1.console.aws.amazon.com/
Cognito Users: https://eu-west-1.console.aws.amazon.com/cognito/
DynamoDB Tables: https://eu-west-1.console.aws.amazon.com/dynamodb/
```

### Credenciales:
```
Email: lalanza@protexwear.com
Password: TempAdmin123!
```

### Funcionalidades Disponibles:
- ✅ **Gestión de productos** (CRUD completo)
- ✅ **Gestión de pedidos** (estados, tracking)
- ✅ **Gestión de usuarios** (roles, permisos)
- ✅ **Interface nativa** (sin código)
- ✅ **Responsive design** (móvil/tablet)
- ✅ **Validaciones automáticas** (campos requeridos)
- ✅ **Relaciones automáticas** (pedidos ↔ usuarios)

---

## 🚀 PRÓXIMOS PASOS

### Una vez habilitado:
1. **Enviar URL a Lalanza** (canal privado)
2. **Confirmar acceso** funciona
3. **Training session** (15 min) para mostrar funcionalidades
4. **Documentar procesos** administrativos

### Para Lalanza:
1. **Login inicial** y cambio de password
2. **Explorar interface** y funcionalidades
3. **Crear productos de prueba**
4. **Reportar bugs** o mejoras necesarias

---

**⏰ TIMELINE**: Completar hoy para que Lalanza pueda empezar mañana con QA.

**📞 CONTACTO**: Kiro AI Assistant para soporte técnico post-setup.