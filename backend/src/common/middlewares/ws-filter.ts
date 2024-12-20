import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
} from '@nestjs/common';
import {WsBadRequestException, WsTypeException, WsUnknownException} from '../exceptions/ws-exceptions';
import {SocketWithAuth} from "@/common/common.types";

@Catch()
export class WsFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const socket: SocketWithAuth = host.switchToWs().getClient();

        if (exception instanceof BadRequestException) {
            const exceptionData = exception.getResponse();

            // @ts-ignore
            const exceptionMessage = exceptionData['message'] ?? exceptionData ?? exception.name;

            const wsException = new WsBadRequestException(exceptionMessage);
            socket.emit('exception', wsException.getError());
            return;
        }

        if (exception instanceof WsTypeException) {
            socket.emit('exception', exception.getError());
            return;
        }

        const wsException = new WsUnknownException(exception.message);
        socket.emit('exception', wsException.getError());
    }
}