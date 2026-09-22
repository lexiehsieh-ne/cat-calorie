export type VisualAid = "body-condition";

export type CalorieTurn = {
  role: "assistant" | "user";
  content: string;
  visualAid?: VisualAid;
};

export type CatEnvironment = "indoor" | "outdoor" | "both";

export type CatProfile = {
  breed: string;
  ageYears: number;
  ageMonths: number;
  environment: CatEnvironment;
};

export type CalorieRequest = {
  profile: CatProfile;
  history: CalorieTurn[];
};

export type CalorieQuestionResponse = {
  type: "question";
  question: string;
  visualAid?: VisualAid;
};

export type FoodSuggestion = {
  brand: string;
  productType: string;
  form: "dry" | "wet";
  dailyPortion: string;
  note: string;
};

export type CalorieResultResponse = {
  type: "result";
  dailyCalories: number;
  lifeStage: string;
  basis: string;
  activityRecommendation: string;
  feedingGuidelines: string[];
  nutrientNotes: string[];
  foodSuggestions: FoodSuggestion[];
  cautions: string[];
};

export type CalorieResponse = CalorieQuestionResponse | CalorieResultResponse;

export const MAX_FOLLOWUP_QUESTIONS = 6;

export const ENVIRONMENT_LABELS: Record<CatEnvironment, string> = {
  indoor: "純室內飼養",
  outdoor: "可自由外出",
  both: "室內外皆可",
};
