import { PomodoroFocusType } from "../types/pomodoro";

export const timeMap = new Map<PomodoroFocusType, number>([
  ["Focus", 1],
  ["Rest", 2],
]);
