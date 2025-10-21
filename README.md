# E‑commerce Ropa de Trabajo

Plataforma de tienda online para una empresa local de ropa de trabajo: catálogo, carrito, checkout con pasarela de pago, compra como invitado y login con Google. Infraestructura sobre AWS (S3 + EC2 + DynamoDB + Cognito).

## Monorepo

```
ecommerce-protex-wear/
├─ apps/
│  ├─ frontend/      # Web (HTML/CSS/JS o framework)
│  └─ backend/       # API (Node/Express u otra)
├─ infra/            # Infraestructura AWS (Terraform/CDK/diagramas)
├─ db/               # Esquemas y seeds DynamoDB
├─ docs/             # Documentación del proyecto
└─ .github/          # CI/CD, plantillas y CODEOWNERS
```

## Equipo
- **Daniel Jesús Ibáñez Betés** — *Arquitecto del Sistema y Coordinador del Proyecto* ([ibanezbetes](https://github.com/ibanezbetes))
- **Mario Cortés Cantín** — *Responsable de la Pasarela de Pago y Procesamiento de Transacciones* ([MarioCortes9](https://github.com/MarioCortes9))
- **Jesús Losadas Carreras** — *Desarrollador del Módulo de Carrito de la Compra* ([jesusl0sada](https://github.com/jesusl0sada))
- **Daniel Lalanza Hernández** — *Desarrollador de Intranet y Autenticación de Usuarios* ([DanielLalanza](https://github.com/DanielLalanza))
- **Dionis Octavio Álvarez Escorcia** — *Diseñador de Interfaces y Maquetación Front‑End* ([DionisOctavio](https://github.com/DionisOctavio))
- **Yeray Espinosa Salvador** — *Diseñador UI/UX y Responsable de Paleta y Estilo Visual* ([YerayEspinosaEsteban](https://github.com/YerayEspinosaEsteban))
- **Daniel Lazar Badorrey** — *Desarrollador Backend y Estructura del Servidor* ([danilazar06](https://github.com/danilazar06))

## Desarrollo rápido

1. Instala dependencias en cada app y levanta dev.
2. Env vars en `.env` (no subir a Git).  
3. PRs a `dev`, revisiones, merge y despliegue.
