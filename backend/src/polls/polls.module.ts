import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PollsController } from '@/polls/polls.controller';
import { PollsService } from '@/polls/polls.service';
import {PollsRepository} from "@/polls/polls.repository";
import {ConfigRedisModule} from "@/redis/redis.config";
import {JwtModuleConfig} from "@/common/jwt.config";

@Module({
  imports: [ConfigModule, ConfigRedisModule, JwtModuleConfig],
  controllers: [PollsController],
  providers: [PollsService, PollsRepository],
})
export class PollsModule {}
