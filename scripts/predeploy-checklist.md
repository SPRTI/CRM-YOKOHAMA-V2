# Predeploy técnico

## 1) Variables API
- DATABASE_URL
- JWT_SECRET
- CORS_ORIGIN
- CRM_ADMIN_EMAIL
- CRM_ADMIN_PASSWORD
- CRM_N8N_API_KEY

## 2) Variables WEB
- API_BASE_URL
- NEXT_PUBLIC_API_URL

## 3) SQL a correr
1. `apps/api/sql/crm_v10_consolidated.sql`
2. cualquier SQL adicional del bot que aún no esté aplicado

## 4) n8n
Agregar:
- `CRM_API_URL`
- `CRM_N8N_API_KEY`

Importar el workflow del bot integrado con CRM.

## 5) Validaciones
- login funciona
- inbox carga chats
- detalle de chat carga mensajes
- bot global on/off cambia en CRM
- bot por chat on/off cambia en CRM
- blacklist se refleja
- integración n8n responde `control-state`
