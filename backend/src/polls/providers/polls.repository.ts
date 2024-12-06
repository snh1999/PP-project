import { Inject, InternalServerErrorException } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis} from 'ioredis';
import { IORedisKey } from '@/redis/redis.constants';
import {TParticipant, Poll, TCreatePoll} from "@/polls/types/polls.types";

@Injectable()
export class PollsRepository {
  private readonly ttl: string;
  private readonly logger = new Logger(PollsRepository.name);

  constructor(
    configService: ConfigService,
    @Inject(IORedisKey) private readonly redisClient: Redis,
  ) {
    this.ttl = configService.get('POLL_DURATION') ?? '';
  }


  async createPoll(createPollData: TCreatePoll): Promise<Poll> {
    const poll = {
      ...createPollData,
      participants: {},
    };

    const key = poll.id;

    try {
      await this.redisClient
        .multi([
          ['send_command', 'JSON.SET', key, '.', JSON.stringify(poll)],
          ['expire', key, this.ttl],
        ])
        .exec();
      return poll;
    } catch (e) {
      this.logger.error(`Failed to add poll ${JSON.stringify(poll)}\n${e}`);
      throw new InternalServerErrorException("Something went wrong creating poll");
    }
  }

  async getPoll(pollID: string): Promise<Poll> {
    this.logger.log(`Attempting to get poll with: ${pollID}`);

    const key = `polls:${pollID}`;

    try {
      // const currentPoll = await this.redisClient.sendCommand(
      //     new Redis.Command("JSON.GET", [pollID, "."])
      // ) as string;
      const currentPoll = await this.redisClient.call(
          'JSON.GET',
          key,
          '.',
      ) as string;

      this.logger.verbose(currentPoll);

      // if (currentPoll?.hasStarted) {
      //   throw new BadRequestException('The poll has already started');
      // }

      return JSON.parse(currentPoll);
    } catch (e) {
      this.logger.error(`Failed to get pollID ${pollID}`);
      throw e;
    }
  }

  async addParticipant({
    pollID,
    userID,
    name,
  }: TParticipant): Promise<Poll> {
    this.logger.log(
      `Attempting to add a participant with userID/name: ${userID}/${name} to pollID: ${pollID}`,
    );

    const key = `polls:${pollID}`;
    const participantPath = `.participants.${userID}`;

    try {
      await this.redisClient.call(
        'JSON.SET',
        key,
        participantPath,
        JSON.stringify(name),
      );

      const pollJSON = await this.redisClient.call(
        'JSON.GET',
        key,
        '.',
      ) as string;

      const poll = JSON.parse(pollJSON) as Poll;

      this.logger.debug(`Total participants for pollID: ${pollID}:`, poll.participants);

      return poll;
    } catch (e) {
      this.logger.error(`Failed to add a participant: ${userID}(${name}) to ${pollID}`,);
      throw new InternalServerErrorException("Something went wrong creating poll");
    }
  }
}
