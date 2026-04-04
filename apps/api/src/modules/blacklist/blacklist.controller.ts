import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { BlacklistService } from './blacklist.service';
import { CreateBlacklistDto } from './dto/create-blacklist.dto';

@Controller('blacklist')
@Roles('admin', 'supervisor')
export class BlacklistController {
  constructor(private readonly blacklistService: BlacklistService) {}

  @Get()
  list() {
    return this.blacklistService.list();
  }

  @Post()
  create(@Body() dto: CreateBlacklistDto) {
    return this.blacklistService.create(dto);
  }

  @Delete(':phone')
  remove(@Param('phone') phone: string) {
    return this.blacklistService.remove(phone);
  }
}