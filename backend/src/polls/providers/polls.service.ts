import { Injectable, Logger} from '@nestjs/common';
import { CreatePollDto, JoinPollDto } from '@/polls/types/polls.dto';
import { customAlphabet, nanoid } from 'nanoid';
import {PollsRepository} from "@/polls/providers/polls.repository";
import {AddPollOption, Poll, TAddParticipant, TRejoinPollData} from "@/polls/types/polls.types";
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

    return this.pollsRepository.addParticipant(joinPollData);
  }

  async leave(): Promise<void> {}

  async getPoll(id: string): Promise<Poll> {
    return this.pollsRepository.getPoll(id);
  }

  private getPollID(length: number= 6) {
    return customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', length)(length);
  }

  async addParticipant(addParticipant: TAddParticipant): Promise<Poll> {
    return this.pollsRepository.addParticipant(addParticipant);
  }

  async removeParticipant(
      pollID: string,
      userID: string,
  ): Promise<Poll | void> {
    const poll = await this.pollsRepository.getPoll(pollID);

    if (!poll.hasStarted) {
      return this.pollsRepository.removeParticipant(
          pollID,
          userID,
      );
    }
  }

  async addOption({
                        pollID,
                        userID,
                        text,
                      }: AddPollOption): Promise<Poll> {
    return this.pollsRepository.addOption({
      pollID,
      optionID: nanoid(8),
      pollOption: {
        userID,
        text,
      },
    });
  }

  async removeOption(pollID: string, nominationID: string): Promise<Poll> {
    return this.pollsRepository.removeOption(pollID, nominationID);
  }
}
