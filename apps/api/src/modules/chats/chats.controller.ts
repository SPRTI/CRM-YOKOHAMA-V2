import { Body, Controller, Get, Header, Param, Post, Query, Res } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ListChatsDto } from './dto/list-chats.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { Response } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';

@Roles('admin', 'supervisor', 'agent')
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  listChats(@Query() query: ListChatsDto) {
    return this.chatsService.listChats(query);
  }

  @Get(':phone')
  getChat(@Param('phone') phone: string) {
    return this.chatsService.getChat(phone);
  }

  @Get(':phone/export.txt')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  async exportTxt(@Param('phone') phone: string, @Res() res: Response) {
    const txt = await this.chatsService.exportHistoryText(phone);
    res.setHeader('Content-Disposition', `attachment; filename="chat-${phone}.txt"`);
    res.send(txt);
  }

  @Get(':phone/export.json')
  @Header('Content-Type', 'application/json; charset=utf-8')
  async exportJson(@Param('phone') phone: string, @Res() res: Response) {
    const json = await this.chatsService.exportHistoryJson(phone);
    res.setHeader('Content-Disposition', `attachment; filename="chat-${phone}.json"`);
    res.send(json);
  }

  @Post(':phone/notes')
  addNote(@Param('phone') phone: string, @Body() dto: CreateNoteDto) {
    return this.chatsService.addNote(phone, dto);
  }

  @Roles('admin', 'supervisor')
  @Post(':phone/bot/disable')
  disableBot(@Param('phone') phone: string) {
    return this.chatsService.setBotForChat(phone, false);
  }

  @Roles('admin', 'supervisor')
  @Post(':phone/bot/enable')
  enableBot(@Param('phone') phone: string) {
    return this.chatsService.setBotForChat(phone, true);
  }

  @Roles('admin', 'supervisor', 'agent')
  @Post(':phone/takeover')
  takeover(@Param('phone') phone: string, @Body() body: { assignedTo?: string }) {
    return this.chatsService.setTakeover(phone, body?.assignedTo);
  }

  @Roles('admin', 'supervisor')
  @Post(':phone/release')
  release(@Param('phone') phone: string) {
    return this.chatsService.releaseTakeover(phone);
  }

  @Roles('admin', 'supervisor')
  @Post(':phone/reset-context')
  resetContext(@Param('phone') phone: string) {
    return this.chatsService.resetContext(phone);
  }

  @Roles('admin')
  @Post('reset-all')
  resetAll() {
    return this.chatsService.resetAllContexts();
  }
}