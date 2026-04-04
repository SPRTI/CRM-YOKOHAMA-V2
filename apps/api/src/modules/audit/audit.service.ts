import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(entityType: string, action: string, options?: { entityId?: string; actor?: string; payload?: unknown }) {
    return this.prisma.auditLog.create({
      data: {
        entityType,
        entityId: options?.entityId ?? null,
        action,
        actor: options?.actor ?? 'crm',
        payload: options?.payload as any,
      },
    });
  }

  async recent(limit = 100) {
    return this.prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: limit });
  }
}
