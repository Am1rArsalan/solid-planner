export type PomodoroType = {
  _id: string;
  title: string;
  current: number;
  end: number;
  done: boolean;
};

export type PomodoroFocusType = "Focus" | "Rest";
export type PomodoroTimerState = "PLAY" | "PAUSE";
