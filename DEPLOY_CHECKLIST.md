# Yokohama CRM - Checklist pre-deploy

## Base de datos
- [ ] Ejecutar SQL del bot existente
- [ ] Ejecutar `apps/api/sql/crm_v3_tables.sql`
- [ ] Ejecutar `apps/api/sql/crm_v4_tables.sql`
- [ ] Ejecutar `apps/api/sql/crm_v5_tables.sql`
- [ ] Ejecutar `apps/api/sql/crm_v6_tables.sql`
- [ ] Ejecutar `apps/api/sql/crm_v10_consolidated.sql`

## Variables API
- [ ] DATABASE_URL
- [ ] JWT_SECRET
- [ ] CORS_ORIGIN
- [ ] PORT
- [ ] CRM_ADMIN_EMAIL
- [ ] CRM_ADMIN_PASSWORD
- [ ] CRM_N8N_API_KEY

## Variables Web
- [ ] API_BASE_URL
- [ ] NEXT_PUBLIC_API_URL

## Integración bot
- [ ] Configurar `CRM_API_URL` en n8n
- [ ] Configurar `CRM_N8N_API_KEY` en n8n
- [ ] Confirmar que el workflow usa `control-state`
- [ ] Confirmar sync de `decision`, `order-draft` y `reservation-draft`

## Validaciones manuales
- [ ] Login admin
- [ ] Crear usuario
- [ ] Inbox de chats
- [ ] Apagar bot global
- [ ] Apagar bot por chat
- [ ] Takeover humano
- [ ] Blacklist
- [ ] Incidencias
- [ ] Export TXT/JSON
- [ ] Pedido borrador
- [ ] Reserva borrador
