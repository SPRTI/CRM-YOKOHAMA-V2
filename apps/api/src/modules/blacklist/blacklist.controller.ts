import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';
import { CreateBlacklistDto } from './dto/create-blacklist.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('blacklist')
export @Roles('admin', 'supervisor')
export class BlacklistController {
  constructor(private readonly blacklistService: BlacklistService) {}

  @Get()
  list() {
    return this.blacklistService.list();
  }

  @Post()
  add(@Body() dto: CreateBlacklistDto) {
    return this.blacklistService.add(dto);
  }

  @Delete(':phone')
  remove(@Param('phone') phone: string) {
    return this.blacklistService.remove(phone);
  }
}