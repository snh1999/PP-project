import {Logger, UseFilters, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {
    OnGatewayInit,
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import {WsFilter} from "@/common/middlewares/ws-filter";
import {GatewayAdminGuard} from "@/common/guards/admin-guard";
import {SocketWithAuth} from "@/common/common.types";
import { PollsService } from './polls.service';
import {AddOptionDto} from "@/polls/types/polls.dto";

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
    constructor(private readonly pollsService: PollsService) {}

    afterInit(): void {
        this.logger.log(`Websocket Gateway initialized.`);
    }

    async handleConnection(socket: SocketWithAuth) {
        const sockets = this.io.sockets;

        this.logger.log(`Socket client: ${socket.id} connected!`);
        this.logger.log(`Number of connected sockets: ${sockets.size}`);

        const roomName = socket.pollID;
        await socket.join(roomName);

        const connectedClients = this.getClientCount(roomName);

        this.logger.debug(`user ${socket.userID} joined room ${roomName}`,);
        this.logger.debug(`Total participant connected to room '${roomName}': ${connectedClients}`);

        const updatedPoll = await this.pollsService.addParticipant({
            pollID: socket.pollID,
            userID: socket.userID,
            name: socket.name,
        });

        this.io.to(roomName).emit('poll_updated', updatedPoll);
    }

    async handleDisconnect(socket: SocketWithAuth) {
        const sockets = this.io.sockets;

        const { pollID, userID } = socket;
        const updatedPoll = await this.pollsService.removeParticipant(
            pollID,
            userID,
        );

        const clientCount = this.getClientCount(socket.pollID);

        this.logger.log(`Disconnected socket id: ${socket.id}`);
        this.logger.debug(`Number of connected sockets: ${sockets.size}`);
        this.logger.debug(`Total participant connected to room '${socket.pollID}': ${clientCount}`);

        if (updatedPoll) {
            this.io.to(pollID).emit('poll_updated', updatedPoll);
        }
    }

    @UseGuards(GatewayAdminGuard)
    @SubscribeMessage('remove_participant')
    async removeParticipant(
        @MessageBody('id') id: string,
        @ConnectedSocket() client: SocketWithAuth,
    ) {
        this.logger.debug(`Removing participant ${id} from poll ${client.pollID}`);

        const updatedPoll = await this.pollsService.removeParticipant(
            client.pollID,
            id,
        );

        if (updatedPoll) {
            this.io.to(client.pollID).emit('poll_updated', updatedPoll);
        }
    }

    private getClientCount(roomName: string) {
       return this.io.adapter.rooms?.get(roomName)?.size ?? 0
    }

    @SubscribeMessage('add_option')
    async addOption(
        @MessageBody() option: AddOptionDto,
        @ConnectedSocket() client: SocketWithAuth,
    ): Promise<void> {
        this.logger.debug(`Adding option by user ${client.userID} to poll ${client.pollID}\n${option.text}`);

        const updatedPoll = await this.pollsService.addOption({
            pollID: client.pollID,
            userID: client.userID,
            text: option.text,
        });

        this.io.to(client.pollID).emit('poll_updated', updatedPoll);
    }

    @UseGuards(GatewayAdminGuard)
    @SubscribeMessage('remove_option')
    async removeOption(
        @MessageBody('id') optionID: string,
        @ConnectedSocket() client: SocketWithAuth,
    ): Promise<void> {
        this.logger.debug(`Attempting to remove option ${optionID} from poll ${client.pollID}`);

        const updatedPoll = await this.pollsService.removeOption(
            client.pollID,
            optionID,
        );

        this.io.to(client.pollID).emit('poll_updated', updatedPoll);
    }
}