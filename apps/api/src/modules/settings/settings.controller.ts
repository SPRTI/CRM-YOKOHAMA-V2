import { Body, Controller, Get, Post } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Roles } from '../auth/decorators/roles.decorator';

@Roles('admin', 'supervisor')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getSettings() {
    return this.settingsService.getSettings();
  }

  @Get('overview')
  getOverview() {
    return this.settingsService.getOverview();
  }

  @Post('bot/enabled')
  setBotEnabled(@Body() body: { enabled: boolean }) {
    return this.settingsService.setBotEnabled(Boolean(body?.enabled));
  }

  @Post('maintenance')
  setMaintenance(@Body() body: { enabled: boolean }) {
    return this.settingsService.setMaintenanceMode(Boolean(body?.enabled));
  }
}