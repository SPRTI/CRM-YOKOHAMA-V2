import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class N8nApiKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const provided = req.headers['x-api-key'] || req.headers['x-n8n-api-key'];
    const expected = this.config.get<string>('CRM_N8N_API_KEY') || '';

    if (!expected) return true;
    if (provided && String(provided) === expected) return true;
    throw new UnauthorizedException('Invalid n8n api key');
  }
}
