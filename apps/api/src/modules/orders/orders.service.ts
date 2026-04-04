import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  async syncFromConversationState(limit = 300) {
    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT phone, customer_name, branch, service_type, delivery_address, payment_method,
             last_customer_message, last_responded_message_id, updated_at
      FROM conversation_state
      WHERE current_intent = 'order'
      ORDER BY updated_at DESC
      LIMIT ${Number(limit)}
    `);

    for (const row of rows) {
      await this.prisma.orderDraft.upsert({
        where: { id: `${row.phone}-${row.updated_at.toISOString()}` },
        update: {},
        create: {
          id: `${row.phone}-${row.updated_at.toISOString()}`,
          phone: row.phone,
          customerName: row.customer_name || null,
          branch: row.branch || null,
          serviceType: row.service_type || null,
          itemsSummary: row.last_customer_message || null,
          deliveryAddress: row.delivery_address || null,
          paymentMethod: row.payment_method || null,
          status: 'pending_validation',
          sourceMessageId: row.last_responded_message_id || null,
          createdAt: row.updated_at,
          updatedAt: row.updated_at,
        },
      });
    }
  }

  async list() {
    await this.syncFromConversationState(150);
    return this.prisma.orderDraft.findMany({ orderBy: { updatedAt: 'desc' }, take: 200 });
  }

  async updateStatus(id: string, status: string) {
    const row = await this.prisma.orderDraft.update({ where: { id }, data: { status } });
    await this.audit.log('order_draft', 'status_changed', { entityId: id, payload: { status } });
    return row;
  }
}
