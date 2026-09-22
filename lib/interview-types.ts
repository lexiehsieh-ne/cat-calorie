export type InterviewTurn = {
  role: "interviewer" | "candidate";
  content: string;
};

export type InterviewRequest = {
  jobDescription: string;
  totalQuestions: number;
  history: InterviewTurn[];
};

export type InterviewQuestionResponse = {
  type: "question";
  questionNumber: number;
  question: string;
};

export type QuestionFeedback = {
  questionNumber: number;
  question: string;
  answer: string;
  comment: string;
  betterAnswer: string;
};

export type InterviewFinalResponse = {
  type: "final";
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  questionFeedback: QuestionFeedback[];
};

export type InterviewResponse = InterviewQuestionResponse | InterviewFinalResponse;

export const DEFAULT_TOTAL_QUESTIONS = 3;
export const MIN_TOTAL_QUESTIONS = 1;
export const MAX_TOTAL_QUESTIONS = 10;
