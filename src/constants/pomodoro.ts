import { PomodoroFocusType } from "../types/pomodoro";

export const timeMap = new Map<PomodoroFocusType, number>([
  ["Focus", 25],
  ["Rest", 5],
]);
