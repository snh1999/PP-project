import {Body, Controller, Delete, Patch, Post, Req, UseGuards} from '@nestjs/common';
import { PollsService } from '@/polls/providers/polls.service';
import { CreatePollDto, JoinPollDto } from '@/polls/types/polls.dto';
import {AuthGuard} from "@/common/guards/auth-guard";
import {RequestWithAuth} from "@/common/common.types";

@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Post()
  async create(@Body() createPollDto: CreatePollDto): Promise<any> {
    return this.pollsService.create(createPollDto);
  }

  @Post('join')
  async join(@Body() joinPollDto: JoinPollDto): Promise<any> {
    return this.pollsService.join(joinPollDto);
  }

  @UseGuards(AuthGuard)
  @Patch('join')
  async rejoin(@Req() request: RequestWithAuth) {
    return this.pollsService.rejoin({...request});
  }

  @Delete('join')
  async leave() {
    return this.pollsService.leave();
  }
}
