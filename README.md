# Yokohama CRM v10

CRM operativo para Yokohama pensado para correr con Docker + Coolify.

## Incluye
- API NestJS
- Frontend Next.js
- Auth JWT
- Inbox de chats con filtros
- Detalle de conversación con exportación TXT/JSON
- Incidencias persistentes con asignación/resolución
- Blacklist
- Controles globales del bot
- Pedidos y reservas borrador
- Historial ligero
- Auditoría
- Base para realtime operativo
- Endpoints de integración con n8n
- Gestión de usuarios y roles
- Checklist pre-deploy

## SQL recomendado
1. Tablas existentes del bot/n8n
2. `apps/api/sql/crm_v10_consolidated.sql`

## Variables importantes
### API
- DATABASE_URL
- JWT_SECRET
- CORS_ORIGIN
- PORT
- CRM_ADMIN_EMAIL
- CRM_ADMIN_PASSWORD
- CRM_N8N_API_KEY

### Web
- API_BASE_URL
- NEXT_PUBLIC_API_URL

## Integración con n8n
Antes de responder, el workflow del bot debe consultar:

`GET /integrations/n8n/control-state/:phone`

Si `shouldBotReply` es false, el bot debe guardar inbound y terminar sin responder.

Después de clasificar/decidir, n8n puede sincronizar:
- `POST /integrations/n8n/decision`
- `POST /integrations/n8n/order-draft`
- `POST /integrations/n8n/reservation-draft`

Todos aceptan `x-api-key` si definís `CRM_N8N_API_KEY`.

## Archivos útiles
- `DEPLOY_CHECKLIST.md`
- `apps/api/.env.example`
- `apps/web/.env.example`
- `apps/api/sql/crm_v10_consolidated.sql`

## Arranque local rápido
1. Copiar variables necesarias
2. Ejecutar:
   - `pnpm install`
   - `pnpm check:env:api`
   - `pnpm local:up`

## Coolify
Crear dos servicios desde el mismo repo:
- API usando `apps/api/Dockerfile`
- WEB usando `apps/web/Dockerfile`

Dominios sugeridos:
- `api-crm.aeternum.red`
- `crm.aeternum.red`

## n8n
El bot debe consumir:
- `GET /integrations/n8n/control-state/:phone`
- `POST /integrations/n8n/decision`
- `POST /integrations/n8n/order-draft`
- `POST /integrations/n8n/reservation-draft`
