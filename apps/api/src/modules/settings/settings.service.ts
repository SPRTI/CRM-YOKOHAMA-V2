import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  async getSettings() {
    const current = await this.prisma.botGlobalSetting.findFirst();
    if (current) return current;
    return this.prisma.botGlobalSetting.create({ data: {} });
  }

  async getOverview() {
    const [settings, chats, incidents, blacklisted, withAgent, botDisabled, orders, reservations] = await Promise.all([
      this.getSettings(),
      this.prisma.$queryRawUnsafe<any[]>(`SELECT COUNT(*)::int AS total FROM conversation_state`),
      this.prisma.$queryRawUnsafe<any[]>(`SELECT COUNT(*)::int AS total FROM incident_state WHERE status IN ('open', 'in_review')`),
      this.prisma.$queryRawUnsafe<any[]>(`SELECT COUNT(*)::int AS total FROM bot_blacklist WHERE active = true`),
      this.prisma.$queryRawUnsafe<any[]>(`SELECT COUNT(*)::int AS total FROM chat_controls WHERE human_takeover = true`),
      this.prisma.$queryRawUnsafe<any[]>(`SELECT COUNT(*)::int AS total FROM chat_controls WHERE bot_enabled = false`),
      this.prisma.$queryRawUnsafe<any[]>(`SELECT COUNT(*)::int AS total FROM order_drafts WHERE status IN ('pending_validation', 'in_review')`),
      this.prisma.$queryRawUnsafe<any[]>(`SELECT COUNT(*)::int AS total FROM reservation_drafts WHERE status IN ('pending_validation', 'in_review')`),
    ]);

    const latestAudit = await this.prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 12 });

    return {
      settings,
      latestAudit,
      totals: {
        chats: chats?.[0]?.total ?? 0,
        incidents: incidents?.[0]?.total ?? 0,
        blacklisted: blacklisted?.[0]?.total ?? 0,
        withAgent: withAgent?.[0]?.total ?? 0,
        botDisabled: botDisabled?.[0]?.total ?? 0,
        ordersPending: orders?.[0]?.total ?? 0,
        reservationsPending: reservations?.[0]?.total ?? 0,
      },
    };
  }

  async setBotEnabled(enabled: boolean) {
    const current = await this.prisma.botGlobalSetting.findFirst();
    const row = current
      ? await this.prisma.botGlobalSetting.update({ where: { id: current.id }, data: { botEnabled: enabled } })
      : await this.prisma.botGlobalSetting.create({ data: { botEnabled: enabled } });
    await this.audit.log('bot_global_settings', enabled ? 'bot_enabled' : 'bot_disabled', { payload: { enabled } });
    return row;
  }

  async setMaintenanceMode(enabled: boolean) {
    const current = await this.prisma.botGlobalSetting.findFirst();
    const row = current
      ? await this.prisma.botGlobalSetting.update({ where: { id: current.id }, data: { maintenanceMode: enabled } })
      : await this.prisma.botGlobalSetting.create({ data: { maintenanceMode: enabled } });
    await this.audit.log('bot_global_settings', enabled ? 'maintenance_enabled' : 'maintenance_disabled', { payload: { enabled } });
    return row;
  }
}
