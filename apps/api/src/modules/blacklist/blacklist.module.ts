import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { BlacklistController } from './blacklist.controller';
import { BlacklistService } from './blacklist.service';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [BlacklistController],
  providers: [BlacklistService],
})
export class BlacklistModule {}
