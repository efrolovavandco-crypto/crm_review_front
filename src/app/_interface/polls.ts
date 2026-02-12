export interface Poll {
  id: number;
  title: string;
  description?: string;
  questions: Question[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PollRequest {
  title: string;
  description?: string;
  questions: Question[];
  isActive?: boolean;
}

export interface Question {
  id?: number;
  text: string;
  isRequired?: boolean;
  answers: Answer[];
  order?: number;
}

export interface Answer {
  id?: number;
  text: string;
  isCorrect: boolean;
  order?: number;
}

export interface PollResponse {
  id?: number;
  pollId: number;
  userId?: number;
  answers: UserAnswer[];
  submittedAt: Date;
}

export interface UserAnswer {
  questionId: number;
  answerIds?: number[];
  answerText?: string;
}

export interface PollStats {
  pollId: number;
  totalResponses: number;
  questionStats: QuestionStat[];
  completionRate: number;
}

export interface QuestionStat {
  questionId: number;
  questionText: string;
  answerStats: AnswerStat[];
}

export interface AnswerStat {
  answerId: number;
  answerText: string;
  count: number;
  percentage: number;
}
export interface PollResponse {
  id?: number;
  pollId: number;
  userId?: number;
  answers: UserAnswer[];
  submittedAt: Date;
}

export interface UserPollProgress {
  userId: number;
  pollId: number;
  completed: boolean;
  completedAt?: Date;
  score?: number;
  totalQuestions?: number;
  correctAnswers?: number;
}

export interface PollStats {
  pollId: number;
  totalResponses: number;
  uniqueUsers: number;
  averageScore: number;
  questionStats: QuestionStat[];
  completionRate: number;
  userCompletions: UserCompletion[];
}

export interface UserCompletion {
  userId: number;
  userFullname: string;
  completedAt: Date;
  score: number;
  totalQuestions: number;
}
