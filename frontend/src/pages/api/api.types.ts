export type Poll = {
    id: string;
    topic: string;
    votesPerVoter: number;
    participants: IParticipants;
    adminID: string;
    pollOptions: PollOptions;
    rankings: Rankings;
    results: Results;
    hasStarted: boolean;
};

export interface IParticipants {
    [participantID: string]: string;
}

export type PollOption = {
    userID: string;
    text: string;
};

export type PollOptions = {
    [optionID: string]: PollOption;
};

export type PollOptionInfo = {
    pollID: string;
    optionID: string;
    pollOption: PollOption;
};

export type Results = {
    optionID: string;
    optionText: string;
    score: number;
}[];

export type Rankings = {
    [userID: string]: string[];
};

export type ParticipantRankings = {
    pollID: string;
    userID: string;
    rankings: string[];
};