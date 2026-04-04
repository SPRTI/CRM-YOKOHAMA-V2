import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/realtime' })
export class RealtimeGateway {
  @WebSocketServer()
  server!: Server;

  emitRefresh(event: string, payload: unknown) {
    this.server.emit(event, payload);
    this.server.emit('crm:refresh', { event, payload, at: new Date().toISOString() });
  }
}
