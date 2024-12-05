import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@/redis/redis.module';
import { PollsController } from '@/polls/polls.controller';
import { PollsService } from '@/polls/polls.service';

@Module({
  imports: [ConfigModule, RedisModule],
  controllers: [PollsController],
  providers: [PollsService],
})
export class PollsModule {}
