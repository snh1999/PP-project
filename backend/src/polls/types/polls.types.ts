export type TRejoinPollData = {
  pollID: string;
  userID: string;
  name: string;
};

export type TCreatePoll = {
  id: string;
  topic: string;
  votesPerVoter: number;
  adminID: string;
};

export type TParticipant = {
  pollID: string;
  userID: string;
  name: string;
};

export type TAddParticipant = {
  pollID: string;
  userID: string;
  name: string;
};


export interface IParticipants {
  [participantID: string]: string;
}

export type Poll = {
  id: string;
  topic: string;
  votesPerVoter: number;
  participants: IParticipants;
  adminID: string;
  pollOptions: PollOptions;
  // rankings: Rankings;
  // results: Results;
  hasStarted: boolean;
}


export type PollOption = {
  userID: string;
  text: string;
}

export type PollOptions = {
  [optionID: string]: PollOption;
}

export type PollOptionInfo = {
  pollID: string;
  optionID: string;
  pollOption: PollOption;
};

export type AddPollOption =  PollOption & {
  pollID: string;
};