import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class IncidentsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async syncFromAlerts(limit = 200) {
    const alerts = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT id, phone, COALESCE(branch, '') AS branch, COALESCE(severity, 'low') AS severity,
             COALESCE(reason, complaint_text, summarized_context, 'Sin resumen') AS summary,
             created_at
      FROM admin_alerts
      ORDER BY created_at DESC
      LIMIT ${Number(limit)}
    `);

    for (const alert of alerts) {
      const sourceAlertId =
        alert?.id !== null && alert?.id !== undefined ? Number(alert.id) : null;

      const open = await this.prisma.incidentState.findFirst({
        where: { phone: alert.phone, status: { in: ['open', 'in_review'] } },
        orderBy: { updatedAt: 'desc' },
      });

      if (open) {
        await this.prisma.incidentState.update({
          where: { id: open.id },
          data: {
            severity: alert.severity || open.severity,
            branch: alert.branch || open.branch,
            summary: alert.summary || open.summary,
            sourceAlertId,
            lastAlertAt: alert.created_at,
            lastMessageAt: alert.created_at,
          },
        });
      } else {
        const created = await this.prisma.incidentState.create({
          data: {
            phone: alert.phone,
            status: 'open',
            severity: alert.severity || 'low',
            branch: alert.branch || null,
            summary: alert.summary || 'Sin resumen',
            sourceAlertId,
            lastAlertAt: alert.created_at,
            lastMessageAt: alert.created_at,
          },
        });

        await this.prisma.incidentEvent.create({
          data: {
            incidentId: created.id,
            eventType: 'created_from_alert',
            payload: { sourceAlertId },
          },
        });
      }
    }
  }

  async list() {
    await this.syncFromAlerts(150);
    return this.prisma.incidentState.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 200,
    });
  }

  async resolve(id: string, createdBy = 'crm') {
    const updated = await this.prisma.incidentState.update({
      where: { id },
      data: { status: 'resolved', resolvedAt: new Date() },
    });

    await this.prisma.incidentEvent.create({
      data: { incidentId: id, eventType: 'resolved', createdBy },
    });

    await this.audit.log('incident', 'resolved', {
      entityId: id,
      actor: createdBy,
    });

    return updated;
  }

  async reopen(id: string, createdBy = 'crm') {
    const updated = await this.prisma.incidentState.update({
      where: { id },
      data: { status: 'open', resolvedAt: null },
    });

    await this.prisma.incidentEvent.create({
      data: { incidentId: id, eventType: 'reopened', createdBy },
    });

    await this.audit.log('incident', 'reopened', {
      entityId: id,
      actor: createdBy,
    });

    return updated;
  }

  async assign(id: string, assignedTo: string, createdBy = 'crm') {
    const updated = await this.prisma.incidentState.update({
      where: { id },
      data: { assignedTo, status: 'in_review' },
    });

    await this.prisma.incidentEvent.create({
      data: {
        incidentId: id,
        eventType: 'assigned',
        createdBy,
        payload: { assignedTo },
      },
    });

    await this.audit.log('incident', 'assigned', {
      entityId: id,
      actor: createdBy,
      payload: { assignedTo },
    });

    return updated;
  }
}