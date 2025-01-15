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
  
  @WebSocketGateway({ cors: true }) // Enable WebSocket Gateway with CORS support
  export class LocationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    // @WebSocketServer decorates the server instance for broadcasting messages
    @WebSocketServer()
    server: Server;
  
    // A map to track active users, where the key is the socket ID, and the value is the socket instance
    private activeUsers = new Map<string, Socket>();
  
    /**
     * Handle new client connections
     * This method is called automatically when a client connects to the WebSocket server.
     */
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`); // Log the connection
      this.activeUsers.set(client.id, client); // Add the connected client to the active users map
    }
  
    /**
     * Handle client disconnections
     * This method is triggered when a client disconnects from the server.
     */
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`); // Log the disconnection
      this.activeUsers.delete(client.id); // Remove the client from the active users map
    }
  
    /**
     * Handle location updates from clients
     * This method listens for the "updateLocation" event from connected clients.
     */
    @SubscribeMessage('updateLocation')
    handleLocationUpdate(
      @MessageBody() data: { userId: string; latitude: number; longitude: number }, // The location data sent by the client
      @ConnectedSocket() _client: Socket, // The socket instance of the client that sent the event (marked as unused here)
    ) {
      console.log(`Received location from user ${data.userId}:`, data);
  
      // Broadcast the location update to all connected clients
      this.server.emit('locationUpdate', data);
    }
  }
  