import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocketIOAdapter } from '@/common/middlewares/socketio.adapter';

async function bootstrap() {
  const logger = new Logger('Application starting');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const configService = app.get(ConfigService);
  const port = parseInt(configService.get('PORT') ?? '3000');
  const originPort = parseInt(configService.get('ORIGIN_PORT') ?? '8080');

  app.enableCors({
    origin: [
      `http://localhost:8080/${originPort}`,
      /^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):8080$/,
    ],
  });
  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));
  await app.listen(port);

  logger.log(`Server running on port ${port}`);
}

bootstrap();
