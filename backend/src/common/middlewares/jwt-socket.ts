import {JwtService} from "@nestjs/jwt";
import {Logger} from "@nestjs/common";
import {SocketWithAuth} from "@/common/common.types";

export const createTokenMiddleware =
    (jwtService: JwtService, logger: Logger) =>
        (socket: SocketWithAuth, next: Function) => {
            const token =
                socket.handshake.auth.token || socket.handshake.headers['token'];

            logger.debug(`Validating auth token before connection: ${token}`);

            try {
                const payload = jwtService.verify(token);
                socket.userID = payload.sub;
                socket.pollID = payload.pollID;
                socket.name = payload.name;
                next();
            } catch {
                next(new Error('FORBIDDEN'));
            }
        };