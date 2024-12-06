import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PollsController } from '@/polls/polls.controller';
import { PollsService } from '@/polls/providers/polls.service';
import {PollsRepository} from "@/polls/providers/polls.repository";
import {ConfigRedisModule} from "@/redis/redis.config";
import {JwtModuleConfig} from "@/common/jwt.config";
import {PollsGateway} from "@/polls/providers/polls.gateway";

@Module({
  imports: [ConfigModule, ConfigRedisModule, JwtModuleConfig],
  controllers: [PollsController],
  providers: [PollsService, PollsRepository, PollsGateway],
})
export class PollsModule {}
