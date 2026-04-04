import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateBlacklistDto } from './dto/create-blacklist.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class BlacklistService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  list() {
    return this.prisma.botBlacklist.findMany({ orderBy: { createdAt: 'desc' }, take: 500 });
  }

  async create(dto: CreateBlacklistDto) {
    const row = await this.prisma.botBlacklist.upsert({
      where: { phone: dto.phone },
      update: { active: true, reason: dto.reason || null, createdBy: dto.createdBy || 'crm' },
      create: { phone: dto.phone, reason: dto.reason || null, createdBy: dto.createdBy || 'crm', active: true },
    });
    await this.audit.log('blacklist', 'created', { entityId: dto.phone, actor: dto.createdBy || 'crm', payload: dto });
    return row;
  }

  async remove(phone: string) {
    const row = await this.prisma.botBlacklist.update({ where: { phone }, data: { active: false } });
    await this.audit.log('blacklist', 'removed', { entityId: phone, payload: { phone } });
    return row;
  }
}
