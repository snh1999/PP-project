import { Inject, InternalServerErrorException } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis} from 'ioredis';
import { IORedisKey } from '@/redis/redis.constants';
import {TParticipant, Poll, TCreatePoll, PollOptionInfo} from "@/polls/types/polls.types";

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
      pollOptions: {},
      hasStarted: false,
    };

    const key = `polls:${poll.id}`;

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
    this.logger.log(`Attempting to add participant ${userID}(${name}) to ${pollID}`);

    const key = `polls:${pollID}`;
    const participantPath = `.participants.${userID}`;

    try {
      await this.redisClient.call(
        'JSON.SET',
        key,
        participantPath,
        JSON.stringify(name),
      );

      return this.getPoll(pollID);
    } catch (e) {
      this.logger.error(`Failed to add a participant: ${userID}(${name}) to ${pollID}`,);
      throw new InternalServerErrorException("Something went wrong creating poll");
    }
  }

  async removeParticipant(pollID: string, userID: string): Promise<Poll> {
    this.logger.log(`removing user ${userID} from poll: ${pollID}`);

    const key = `polls:${pollID}`;
    const participantPath = `.participants.${userID}`;

    try {
      await this.redisClient.call('JSON.DEL', key, participantPath);

      return this.getPoll(pollID);
    } catch (e) {
      this.logger.error(`Failed to remove ${userID} from poll: ${pollID}`, e);
      throw new InternalServerErrorException('Failed to remove participant');
    }
  }

  async addOption({
                        pollID,
                        optionID,
                        pollOption,
                      }: PollOptionInfo): Promise<Poll> {
    this.logger.log(`Attempting to add a option: ${pollOption.text} to poll: ${pollID}`);
    // TODO reject same word

    const key = `polls:${pollID}`;
    const optionPath = `.options.${optionID}`;

    try {
      await this.redisClient.call(
          'JSON.SET',
          key,
          optionPath,
          JSON.stringify(pollOption),
      );

      return this.getPoll(pollID);
    } catch (e) {
      this.logger.error(`Failed to add option: ${optionID}/${pollOption.text} to poll: ${pollID}`, e);
      throw new InternalServerErrorException(`Failed to add option: ${optionID}/${pollOption.text} to poll: ${pollID}`);
    }
  }

  async removeOption(pollID: string, optionID: string): Promise<Poll> {
    this.logger.log(`removing option: ${optionID} from poll: ${pollID}`,);

    const key = `polls:${pollID}`;
    const optionPath = `.options.${optionID}`;

    try {
      await this.redisClient.call('JSON.DEL', key, optionPath);

      return this.getPoll(pollID);
    } catch (e) {
      this.logger.error(`Failed to remove option: ${optionID} from poll: ${pollID}`, e,);
      throw new InternalServerErrorException(`Failed to remove option: ${optionID} from poll: ${pollID}`);
    }
  }
}
