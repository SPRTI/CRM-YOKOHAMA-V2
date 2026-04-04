# Runbook de despliegue

## Orden recomendado
1. Subir repo a GitHub
2. Crear base Postgres en Coolify
3. Correr SQL consolidado
4. Desplegar API
5. Configurar variables API
6. Desplegar WEB
7. Configurar variables WEB
8. Importar workflow n8n integrado con CRM
9. Configurar variables n8n:
   - CRM_API_URL
   - CRM_N8N_API_KEY
10. Probar:
   - login
   - chats
   - blacklist
   - control-state
   - bot global off
   - bot por chat off
   - takeover humano

## Verificaciones mínimas
- `/api/health` responde
- dashboard carga
- chats muestran datos reales
- apagar bot global afecta `control-state`
- blacklist devuelve `shouldBotReply=false`
