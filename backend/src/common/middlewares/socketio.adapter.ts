import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import {Server, ServerOptions} from 'socket.io';
import {JwtService} from "@nestjs/jwt";
import {createTokenMiddleware} from "@/common/middlewares/jwt-socket";

export class SocketIOAdapter extends IoAdapter {
    private readonly logger = new Logger(SocketIOAdapter.name);
    constructor(
        // @ts-ignore
        private app: INestApplicationContext,
        private configService: ConfigService,
    ) {
        super(app);
    }

    override createIOServer(port: number, options?: ServerOptions) {
        const clientPort = parseInt(this.configService.get('CLIENT_PORT')??"");

        const cors = {
            origin: [
                `http://localhost:${clientPort}`,
                new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`),
            ],
        };

        this.logger.log('Configuring SocketIO server with custom CORS');

        const optionsWithCORS = {
            ...options,
            cors,
        };

        const jwtService = this.app.get(JwtService);
        const server: Server = super.createIOServer(port, optionsWithCORS);

        // @ts-ignore
        server.of('polls').use(createTokenMiddleware(jwtService, this.logger));

        return server;
    }
}