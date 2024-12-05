import { Injectable } from '@nestjs/common';
import { CreatePollDto, JoinPollDto } from '@/polls/polls.dto';
import { customAlphabet, nanoid } from 'nanoid';

@Injectable()
export class PollsService {
  async create(createPollDto: CreatePollDto) {
    const pollID = this.getPollID();
    const userID = nanoid();

    return {
      ...createPollDto,
      userID,
      pollID,
    };
  }

  async join(joinPollDto: JoinPollDto) {
    return joinPollDto;
  }

  async rejoin(): Promise<void> {}

  async leave(): Promise<void> {}

  private getPollID() {
    return customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
  }
}
