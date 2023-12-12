export interface Prediction {
  letter: string;
  result: string;
}
export interface Statistics {
  win: boolean;
  correctAttempt: number | null;
  gameFinished: boolean;
}
export interface MyObject {
  [key: string]: any;
}
