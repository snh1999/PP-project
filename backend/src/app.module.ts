import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { PollsModule } from './polls/polls.module';

@Module({
  imports: [ConfigModule.forRoot(), RedisModule, PollsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
