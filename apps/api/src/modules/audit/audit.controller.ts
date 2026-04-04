import { Controller, Get, Query } from '@nestjs/common';
import { AuditService } from './audit.service';
import { Roles } from '../auth/decorators/roles.decorator';

@Roles('admin', 'supervisor')
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  list(@Query('limit') limit?: string) {
    const parsed = Number(limit || 100);
    return this.auditService.recent(Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), 500) : 100);
  }
}