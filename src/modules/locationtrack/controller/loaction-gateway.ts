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

@ApiTags('Location') // Group this endpoint under "Location" in Swagger UI
@WebSocketGateway({ cors: true }) // Enable WebSocket Gateway with CORS support
export class LocationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeUsers = new Map<string, Socket>();

  /**
   * Handle new client connections
   */
  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
    this.activeUsers.set(client.id, client);
  }

  /**
   * Handle client disconnections
   */
  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
    this.activeUsers.delete(client.id);
  }

  /**
   * Handle location updates from clients
   * @param data { userId: string, latitude: number, longitude: number }
   */
  @SubscribeMessage('updateLocation')
  @ApiOperation({
    summary: 'Receive location updates from clients',
    description: 'Handles location updates sent by clients to be broadcast to all connected users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Location update received and broadcasted to all clients.',
    type: Object,
    isArray: false,
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
    @ConnectedSocket() client: Socket, // Explicitly mark it as used
  ): void {
    console.log(`Received location from user ${data.userId}:`, data);

    // Optional: Send an acknowledgment back to the sender
    client.emit('locationReceived', { status: 'success', receivedData: data });

    // Broadcast the location update to all connected clients
    this.server.emit('locationUpdate', data);
  }
}
