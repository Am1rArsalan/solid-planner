export type PomodoroType = {
  _id: string;
  title: string;
  current: number;
  end: number;
  done: boolean;
  status: "Backlog" | "Pomodoro";
  order: number;
  created_at: string;
  updated_at: string;
};

export type PomodoroFocusType = "Focus" | "Rest";
export type PomodoroTimerState = "PLAY" | "PAUSE";

export type CreatePomodoroItemDto = {
  title: string;
  order: number;
};
