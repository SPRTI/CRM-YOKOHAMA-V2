import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { Roles } from '../auth/decorators/roles.decorator';

@Roles('admin', 'supervisor', 'agent')
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Get()
  list() {
    return this.incidentsService.list();
  }

  @Post(':id/resolve')
  resolve(@Param('id') id: string) {
    return this.incidentsService.resolve(id, 'crm');
  }

  @Post(':id/reopen')
  reopen(@Param('id') id: string) {
    return this.incidentsService.reopen(id, 'crm');
  }

  @Post(':id/assign')
  assign(@Param('id') id: string, @Body() body: { assignedTo: string }) {
    return this.incidentsService.assign(id, body.assignedTo, 'crm');
  }
}