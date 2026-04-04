import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { Roles } from '../auth/decorators/roles.decorator';

@Roles('admin', 'supervisor', 'agent')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  list() {
    return this.reservationsService.list();
  }

  @Post(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.reservationsService.updateStatus(id, body.status);
  }
}