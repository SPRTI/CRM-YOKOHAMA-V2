import { Public } from '../auth/decorators/public.decorator';
import { Controller, Get } from '@nestjs/common';

@Public()
@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return { ok: true, service: 'yokohama-crm-api' };
  }
}
