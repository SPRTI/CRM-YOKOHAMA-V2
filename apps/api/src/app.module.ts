import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './common/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatsModule } from './modules/chats/chats.module';
import { BlacklistModule } from './modules/blacklist/blacklist.module';
import { IncidentsModule } from './modules/incidents/incidents.module';
import { SettingsModule } from './modules/settings/settings.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { AuditModule } from './modules/audit/audit.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    AuthModule,
    ChatsModule,
    BlacklistModule,
    IncidentsModule,
    SettingsModule,
    OrdersModule,
    ReservationsModule,
    RealtimeModule,
    AuditModule,
    IntegrationsModule,
  ],
})
export class AppModule {}
