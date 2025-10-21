# Backend

API para catálogo, carrito, pedidos, usuarios y pagos.

Rutas sugeridas:
- `GET /products` `GET /products/:id`
- `POST /cart` `PATCH /cart/:id`
- `POST /orders`
- `POST /payments/checkout`
- `POST /auth/callback`

Env vars (ejemplo):
```
PORT=3000
DYNAMODB_TABLE=EcommerceTable
COGNITO_POOL_ID=
COGNITO_CLIENT_ID=
STRIPE_SECRET=
```
