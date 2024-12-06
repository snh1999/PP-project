import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { PollsModule } from './polls/polls.module';
import {JwtModuleConfig} from "@/common/jwt.config";

@Module({
  imports: [ConfigModule.forRoot(), RedisModule, PollsModule, JwtModuleConfig],
  controllers: [],
  providers: [],
})
export class AppModule {}
