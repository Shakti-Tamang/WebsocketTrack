import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@ApiTags('Location') // Grouping for Swagger UI
@WebSocketGateway({ cors: true }) // WebSocket Gateway with CORS
export class LocationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeUsers = new Map<string, Socket>();

  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
    this.activeUsers.set(client.id, client);
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
    this.activeUsers.delete(client.id);
  }

  @SubscribeMessage('updateLocation')
  @ApiOperation({
    summary: 'Receive and Broadcast Location Updates',
    description: 'This event listens to updates from clients and broadcasts the location to all connected clients.',
  })
  @ApiResponse({
    status: 200,
    description: 'Location update received and broadcasted.',
    type: Object,
    schema: {
      example: {
        userId: 'user123',
        latitude: 37.7749,
        longitude: -122.4194,
      },
    },
  })
  handleLocationUpdate(
    @MessageBody() data: { userId: string; latitude: number; longitude: number },
    @ConnectedSocket() client: Socket,
  ): void {
    console.log(`Received location from user ${data.userId}:`, data);

    // Optional acknowledgment to sender
    client.emit('locationReceived', { status: 'success', receivedData: data });

    // Broadcast to all clients
    this.server.emit('locationUpdate', data);
  }
}
