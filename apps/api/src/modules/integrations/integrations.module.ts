import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../common/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { N8nApiKeyGuard } from './guards/n8n-api-key.guard';

@Module({
  imports: [ConfigModule, PrismaModule, AuditModule],
  controllers: [IntegrationsController],
  providers: [IntegrationsService, N8nApiKeyGuard],
})
export class IntegrationsModule {}
