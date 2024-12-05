import { Body, Controller, Delete, Patch, Post } from '@nestjs/common';
import { PollsService } from '@/polls/polls.service';
import { CreatePollDto, JoinPollDto } from '@/polls/polls.dto';

@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Post()
  async create(@Body() createPollDto: CreatePollDto): Promise<any> {
    console.log('called');
    return this.pollsService.create(createPollDto);
  }

  @Post('join')
  async join(@Body() joinPollDto: JoinPollDto): Promise<any> {
    return this.pollsService.join(joinPollDto);
  }

  @Patch('join')
  async rejoin() {
    // return this.pollsService.rejoin();
  }

  @Delete('join')
  async leave() {
    return this.pollsService.leave();
  }
}
