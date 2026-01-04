# 🚀 Mensaje para Slack - Setup Inmediato

---

**📢 @channel - CAMBIO DE ARQUITECTURA - SETUP URGENTE**

¡Hola equipo! 👋

El cambio a la nueva arquitectura serverless está **90% completado**. Para que podáis empezar a trabajar **mañana mismo**, aquí tenéis las instrucciones específicas para cada uno:

## 🔧 SETUP BÁSICO (TODOS)
```bash
git clone https://github.com/ibanezbetes/protex-wear-serverless.git
cd protex-wear-serverless
npm install
```

**⚠️ IMPORTANTE**: Necesitáis credenciales AWS. Escribidme por privado si no las tenéis.

---

## 👨‍💻 **YERAY & OCTAVIO** (Frontend)

**Comandos clave**:
```bash
npm run dev          # Inicia backend (esperar 5-10 min)
# En otra terminal:
cd src && npm run dev # Frontend en http://localhost:5173
```

**Dónde trabajar**: 
- `src/components/` - Componentes UI
- `src/pages/` - Páginas principales  
- `src/contexts/` - Estado global

**Prioridades**: Responsive design, UI polish, performance

---

## 📊 **LAZAR** (Migración Datos)

**Archivo clave**: `migration/products_source.json` (reemplazar con tus datos)

**Comando migración**:
```bash
npm run seed
```

**Formato JSON** (ejemplo en el archivo). **Importante**: Alguien debe tener `npm run dev` ejecutándose antes de migrar.

---

## ⚡ **MARIO & JESÚS** (Backend/Lógica)

**Dónde trabajar**: `amplify/functions/`
- `shipping-calculator/` - Reglas de envío
- `stripe-webhook/` - Procesamiento pagos

**Reglas actuales** (podéis modificar):
- Envío gratis >150€
- Descuentos: PREMIUM 15%, STANDARD 5%
- Zonas: Península 5.99€, Baleares 12.99€, etc.

Si preferís **no tocar código**, pasadme las reglas en JSON y las implemento.

---

## 🔍 **LALANZA** (QA/Admin)

**URLs de testing**:
- Frontend: http://localhost:5173 (cuando alguien ejecute setup)
- AWS Console: https://eu-west-1.console.aws.amazon.com/

**Credenciales admin**: Te las paso por privado.

**Data Manager nativo**: Estará listo en 2-3 días (Task 12).

---

## 🆘 **SI TENÉIS PROBLEMAS**

1. **Credenciales AWS**: Escribidme por privado
2. **Error técnico**: GitHub Issues o aquí en Slack
3. **Urgente**: Llamadme directamente

## 📋 **CONFIRMACIÓN**

Cuando completéis el setup, confirmad aquí con:
- ✅ Setup OK
- ❌ Problema: [describir]

**Objetivo**: Todos operativos mañana. **Documentación completa**: `docs/TEAM_SETUP_INSTRUCTIONS.md`

**¡Vamos a por ello!** 🚀

---

*Ibañez - 4 Enero 2026*