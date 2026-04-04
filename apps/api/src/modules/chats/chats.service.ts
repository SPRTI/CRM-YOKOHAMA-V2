import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { ListChatsDto } from './dto/list-chats.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class ChatsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  private async tableExists(tableName: string) {
    const result = await this.prisma.$queryRawUnsafe<Array<{ exists: boolean }>>(
      `SELECT EXISTS (
         SELECT 1
         FROM information_schema.tables
         WHERE table_schema = 'public' AND table_name = $1
       ) AS exists`,
      tableName,
    );

    return Boolean(result?.[0]?.exists);
  }

  async listChats(filters: ListChatsDto) {
    const conditions: string[] = [];
    const params: any[] = [];

    if (filters.q?.trim()) {
      params.push(`%${filters.q.trim()}%`);
      const idx = params.length;
      conditions.push(`(
        cs.phone ILIKE $${idx}
        OR COALESCE(cs.customer_name, '') ILIKE $${idx}
        OR COALESCE(cs.last_customer_message, '') ILIKE $${idx}
      )`);
    }

    if (filters.branch?.trim()) {
      params.push(filters.branch.trim());
      conditions.push(`COALESCE(cs.branch, '') = $${params.length}`);
    }

    if (filters.bot === 'enabled') conditions.push(`COALESCE(cc.bot_enabled, true) = true`);
    if (filters.bot === 'disabled') conditions.push(`COALESCE(cc.bot_enabled, true) = false`);

    if (filters.status === 'with_agent') conditions.push(`COALESCE(cc.human_takeover, false) = true`);
    if (filters.status === 'blacklist') conditions.push(`COALESCE(bl.active, false) = true`);
    if (filters.status === 'incident') conditions.push(`COALESCE(inc.open_incidents, 0) > 0`);

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    return this.prisma.$queryRawUnsafe<any[]>(
      `
      WITH last_message AS (
        SELECT phone, MAX(created_at) AS last_message_at
        FROM messages
        GROUP BY phone
      ),
      incident_open AS (
        SELECT phone, COUNT(*)::int AS open_incidents
        FROM incident_state
        WHERE status IN ('open', 'in_review')
        GROUP BY phone
      ),
      unread_like AS (
        SELECT phone, COUNT(*)::int AS pending_count
        FROM messages
        WHERE from_me = FALSE
        GROUP BY phone
      )
      SELECT 
        cs.phone,
        COALESCE(cs.customer_name, cs.phone) AS "displayName",
        COALESCE(cs.status, 'active') AS status,
        COALESCE(cc.bot_enabled, true) AS "botEnabled",
        COALESCE(cc.human_takeover, false) AS "humanTakeover",
        cc.assigned_to AS "assignedTo",
        cs.branch,
        cs.current_intent AS "currentIntent",
        cs.last_customer_message AS "lastMessage",
        lm.last_message_at AS "lastMessageAt",
        COALESCE(bl.active, false) AS "blacklisted",
        COALESCE(inc.open_incidents, 0) AS "openIncidents",
        COALESCE(unr.pending_count, 0) AS "pendingCount"
      FROM conversation_state cs
      LEFT JOIN chat_controls cc ON cc.phone = cs.phone
      LEFT JOIN bot_blacklist bl ON bl.phone = cs.phone AND bl.active = true
      LEFT JOIN last_message lm ON lm.phone = cs.phone
      LEFT JOIN incident_open inc ON inc.phone = cs.phone
      LEFT JOIN unread_like unr ON unr.phone = cs.phone
      ${where}
      ORDER BY lm.last_message_at DESC NULLS LAST, cs.updated_at DESC NULLS LAST
      LIMIT 300
      `,
      ...params,
    );
  }

  async getChat(phone: string) {
    const [state] = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM conversation_state WHERE phone = $1 LIMIT 1`,
      phone,
    );

    const messages = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT id, phone, push_name, text, from_me, created_at, message_type, event
       FROM messages
       WHERE phone = $1
       ORDER BY id DESC
       LIMIT 200`,
      phone,
    );

    const [control] = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM chat_controls WHERE phone = $1 LIMIT 1`,
      phone,
    );

    const notes = await this.prisma.chatNote.findMany({ where: { phone }, orderBy: { createdAt: 'desc' }, take: 50 });
    const incidents = await this.prisma.incidentState.findMany({ where: { phone }, orderBy: { updatedAt: 'desc' }, take: 20 });

    const [blacklist] = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM bot_blacklist WHERE phone = $1 AND active = true LIMIT 1`,
      phone,
    );

    const latestOrderDraft = await this.prisma.orderDraft.findFirst({ where: { phone }, orderBy: { updatedAt: 'desc' } });
    const latestReservationDraft = await this.prisma.reservationDraft.findFirst({ where: { phone }, orderBy: { updatedAt: 'desc' } });

    const decisions = (await this.tableExists('bot_message_decisions'))
      ? await this.prisma.$queryRawUnsafe<any[]>(
          `SELECT * FROM bot_message_decisions WHERE phone = $1 ORDER BY created_at DESC LIMIT 30`,
          phone,
        )
      : [];

    const metrics = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT 
         COUNT(*)::int AS total_messages,
         COUNT(*) FILTER (WHERE from_me = FALSE)::int AS inbound_messages,
         COUNT(*) FILTER (WHERE from_me = TRUE)::int AS outbound_messages,
         MAX(created_at) AS last_message_at
       FROM messages
       WHERE phone = $1`,
      phone,
    );

    return {
      phone,
      state,
      control,
      blacklist,
      messages: messages.reverse(),
      notes,
      incidents,
      latestOrderDraft,
      latestReservationDraft,
      decisions: decisions.reverse(),
      metrics: metrics?.[0] ?? null,
    };
  }

  async addNote(phone: string, dto: CreateNoteDto) {
    const note = await this.prisma.chatNote.create({ data: { phone, note: dto.note, createdBy: dto.createdBy ?? 'crm' } });
    await this.audit.log('chat_note', 'created', { entityId: note.id, actor: dto.createdBy ?? 'crm', payload: { phone } });
    return note;
  }

  async setBotForChat(phone: string, enabled: boolean) {
    const result = await this.prisma.chatControl.upsert({
      where: { phone },
      update: { botEnabled: enabled, humanTakeover: !enabled },
      create: { phone, botEnabled: enabled, humanTakeover: !enabled },
    });
    await this.audit.log('chat_control', enabled ? 'bot_enabled' : 'bot_disabled', { entityId: phone, payload: { phone, enabled } });
    return result;
  }

  async setTakeover(phone: string, assignedTo?: string) {
    const result = await this.prisma.chatControl.upsert({
      where: { phone },
      update: { humanTakeover: true, botEnabled: false, assignedTo: assignedTo ?? null, status: 'with_agent' },
      create: { phone, humanTakeover: true, botEnabled: false, assignedTo: assignedTo ?? null, status: 'with_agent' },
    });
    await this.audit.log('chat_control', 'takeover', { entityId: phone, actor: assignedTo ?? 'crm', payload: { phone, assignedTo } });
    return result;
  }

  async releaseTakeover(phone: string) {
    const result = await this.prisma.chatControl.upsert({
      where: { phone },
      update: { humanTakeover: false, botEnabled: true, assignedTo: null, status: 'active' },
      create: { phone, humanTakeover: false, botEnabled: true, status: 'active' },
    });
    await this.audit.log('chat_control', 'takeover_released', { entityId: phone, payload: { phone } });
    return result;
  }

  async resetContext(phone: string) {
    await this.prisma.$executeRawUnsafe(
      `UPDATE conversation_state
       SET current_intent = 'general',
           branch = NULL,
           service_type = NULL,
           delivery_address = NULL,
           payment_method = NULL,
           last_bot_message = NULL,
           last_responded_message_id = NULL,
           status = 'active',
           updated_at = NOW()
       WHERE phone = $1`,
      phone,
    );
    await this.audit.log('conversation_state', 'reset_one', { entityId: phone, payload: { phone } });
    return { ok: true, phone };
  }

  async resetAllContexts() {
    await this.prisma.$executeRawUnsafe(
      `UPDATE conversation_state
       SET current_intent = 'general',
           branch = NULL,
           service_type = NULL,
           delivery_address = NULL,
           payment_method = NULL,
           last_bot_message = NULL,
           last_responded_message_id = NULL,
           status = 'active',
           updated_at = NOW()`,
    );
    await this.audit.log('conversation_state', 'reset_all', { payload: { all: true } });
    return { ok: true };
  }

  async exportHistoryText(phone: string) {
    const messages = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT id, phone, push_name, text, from_me, created_at FROM messages WHERE phone = $1 ORDER BY id ASC LIMIT 5000`,
      phone,
    );
    return messages
      .map((m) => `${m.from_me ? 'BOT' : (m.push_name || 'CLIENTE')} [${new Date(m.created_at).toLocaleString('es-CR')} ]\n${m.text || ''}`)
      .join('\n\n');
  }

  async exportHistoryJson(phone: string) {
    const chat = await this.getChat(phone);
    return JSON.stringify(chat, null, 2);
  }
}
