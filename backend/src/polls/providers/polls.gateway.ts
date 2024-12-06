import {Logger, UseFilters, UsePipes, ValidationPipe} from '@nestjs/common';
import {
    OnGatewayInit,
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import {WsFilter} from "@/common/exceptions/ws-filter";
// import { PollsService } from './polls.service';

@UsePipes(new ValidationPipe())
@UseFilters(new WsFilter())
@WebSocketGateway({
    namespace: 'polls',
})
export class PollsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    private readonly logger = new Logger(PollsGateway.name);
    // @ts-ignore
    @WebSocketServer() io: Namespace;
    // constructor(private readonly pollsService: PollsService) {}


    // Gateway initialized (provided in module and instantiated)
    afterInit(): void {
        this.logger.log(`Websocket Gateway initialized.`);
    }

    handleConnection(client: Socket) {
        const sockets = this.io.sockets;

        this.logger.log(`Client: ${client.id} connected!`);
        this.logger.debug(`Number of connected sockets: ${sockets.size}`);

        this.io.emit('hello', `from ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        const sockets = this.io.sockets;

        this.logger.log(`Disconnected socket id: ${client.id}`);
        this.logger.debug(`Number of connected sockets: ${sockets.size}`);

        // TODO - remove client from poll and send `participants_updated` event to remaining clients
    }
}