import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class IntegrationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
      ) {}

  async getBotControlState(phone: string) {
    const [globalSettings, control, blacklist] = await Promise.all([
      this.prisma.botGlobalSetting.findFirst(),
      this.prisma.chatControl.findUnique({ where: { phone } }),
      this.prisma.botBlacklist.findUnique({ where: { phone } }),
    ]);

    const botGlobalEnabled = globalSettings?.botEnabled ?? true;
    const maintenanceMode = globalSettings?.maintenanceMode ?? false;
    const chatBotEnabled = control?.botEnabled ?? true;
    const humanTakeover = control?.humanTakeover ?? false;
    const blacklisted = Boolean(blacklist?.active);

    return {
      phone,
      botGlobalEnabled,
      maintenanceMode,
      chatBotEnabled,
      humanTakeover,
      blacklisted,
      shouldBotReply: botGlobalEnabled && !maintenanceMode && chatBotEnabled && !humanTakeover && !blacklisted,
      assignedTo: control?.assignedTo ?? null,
      chatStatus: control?.status ?? 'active',
    };
  }

  async upsertDecision(input: {
    phone: string;
    messageId?: string | null;
    decision: string;
    reason?: string | null;
    label?: string | null;
    payload?: unknown;
  }) {
    await this.prisma.$executeRawUnsafe(
      `INSERT INTO bot_message_decisions (phone, message_id, decision, reason, label, payload, created_at)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, NOW())`,
      input.phone,
      input.messageId ?? null,
      input.decision,
      input.reason ?? null,
      input.label ?? null,
      JSON.stringify(input.payload ?? {}),
    );
    await this.audit.log('bot_message_decisions', 'upsert', { entityId: input.phone, payload: input });
    return { ok: true };
  }

  async upsertOrderDraft(input: {
    phone: string;
    customerName?: string | null;
    branch?: string | null;
    serviceType?: string | null;
    itemsSummary?: string | null;
    deliveryAddress?: string | null;
    paymentMethod?: string | null;
    observations?: string | null;
    status?: string | null;
    sourceMessageId?: string | null;
  }) {
    const row = await this.prisma.orderDraft.create({
      data: {
        phone: input.phone,
        customerName: input.customerName ?? null,
        branch: input.branch ?? null,
        serviceType: input.serviceType ?? null,
        itemsSummary: input.itemsSummary ?? null,
        deliveryAddress: input.deliveryAddress ?? null,
        paymentMethod: input.paymentMethod ?? null,
        observations: input.observations ?? null,
        status: input.status ?? 'pending_validation',
        sourceMessageId: input.sourceMessageId ?? null,
      },
    });
    await this.audit.log('order_drafts', 'created_from_n8n', { entityId: row.id, payload: input });
    return row;
  }

  async upsertReservationDraft(input: {
    phone: string;
    customerName?: string | null;
    branch?: string | null;
    peopleCount?: number | null;
    reservationDate?: string | null;
    reservationTime?: string | null;
    observations?: string | null;
    status?: string | null;
    sourceMessageId?: string | null;
  }) {
    const row = await this.prisma.reservationDraft.create({
      data: {
        phone: input.phone,
        customerName: input.customerName ?? null,
        branch: input.branch ?? null,
        peopleCount: input.peopleCount ?? null,
        reservationDate: input.reservationDate ?? null,
        reservationTime: input.reservationTime ?? null,
        observations: input.observations ?? null,
        status: input.status ?? 'pending_validation',
        sourceMessageId: input.sourceMessageId ?? null,
      },
    });
    await this.audit.log('reservation_drafts', 'created_from_n8n', { entityId: row.id, payload: input });
    return row;
  }
}
