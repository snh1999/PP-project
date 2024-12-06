import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class    AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const { accessToken } = request.body;

        try {
            const payload = this.jwtService.verify(accessToken);
            request.userID = payload.sub;
            request.pollID = payload.pollID;
            request.name = payload.name;
            return true;
        } catch {
            throw new ForbiddenException('Invalid token for poll');
        }
    }
}