import {Injectable, Logger} from '@nestjs/common';
import { CreatePollDto, JoinPollDto } from '@/polls/polls.dto';
import { customAlphabet, nanoid } from 'nanoid';
import {PollsRepository} from "@/polls/polls.repository";
import {TRejoinPollData} from "@/polls/polls.types";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class PollsService {
  private readonly logger = new Logger(PollsService.name);
  constructor(private readonly pollsRepository: PollsRepository, private readonly jwtService: JwtService) {
  }

  async create(createPollDto: CreatePollDto) {
    const pollID = this.getPollID();
    const userID = nanoid();

    const poll = await this.pollsRepository.createPoll({
      ...createPollDto,
      id: pollID,
      adminID: userID,
    });

    const signedString = this.jwtService.sign(
        {
          pollID: poll.id,
          name: createPollDto.name,
        },
        {
          subject: userID,
        },
    );

    return {
      poll: poll,
      accessToken: signedString,
    };
  }

  async join(joinPollDto: JoinPollDto) {
    const userID = nanoid();

    this.logger.debug(`Fetching poll: ${joinPollDto.pollID} for : ${userID}`);

    const joinedPoll = await this.pollsRepository.getPoll(joinPollDto.pollID);

    // TODO - create access Token

    return {
      poll: joinedPoll,
      // accessToken: signedString,
    };
  }

  async rejoin(joinPollData: TRejoinPollData) {
    this.logger.debug(`${joinPollData.userID} rejoined poll: ${joinPollData.pollID}`);

    const joinedPoll = await this.pollsRepository.addParticipant(joinPollData);
joinedPoll;
    return joinedPoll;
  }

  async leave(): Promise<void> {}

  private getPollID(length: number= 6) {
    return customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', length)(length);
  }
}
