import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { N8nApiKeyGuard } from './guards/n8n-api-key.guard';

@Controller('integrations/n8n')
@UseGuards(N8nApiKeyGuard)
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get('control-state/:phone')
  controlState(@Param('phone') phone: string) {
    return this.integrationsService.getBotControlState(phone);
  }

  @Post('decision')
  decision(@Body() body: any) {
    return this.integrationsService.upsertDecision(body);
  }

  @Post('order-draft')
  orderDraft(@Body() body: any) {
    return this.integrationsService.upsertOrderDraft(body);
  }

  @Post('reservation-draft')
  reservationDraft(@Body() body: any) {
    return this.integrationsService.upsertReservationDraft(body);
  }
}
