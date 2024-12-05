import { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import IORedis from 'ioredis';
import { RedisAsyncModuleOptions } from '@/redis/redis.types';
import { IORedisKey } from './redis.constants';

@Module({})
export class RedisModule {
  static async registerAsync({
    useFactory,
    imports,
    inject,
  }: RedisAsyncModuleOptions): Promise<DynamicModule> {
    const redisProvider = {
      provide: IORedisKey,
      // @ts-ignore
      useFactory: async (...args) => {
        const { connectionOptions, onClientReady } = await useFactory(...args);

        const client = await new IORedis(connectionOptions);
        if (onClientReady) onClientReady(client);
        return client;
      },
      inject,
    };

    return {
      imports,
      module: RedisModule,
      providers: [redisProvider],
      exports: [redisProvider],
    };
  }
}
