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


export interface IParticipants {
  [participantID: string]: string;
}

export type Poll = {
  id: string;
  topic: string;
  votesPerVoter: number;
  participants: IParticipants;
  adminID: string;
  // nominations: Nominations;
  // rankings: Rankings;
  // results: Results;
  // hasStarted: boolean;
}