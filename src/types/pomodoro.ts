export type TaskType = {
  _id: string;
  title: string;
  current: number;
  end: number;
  done: boolean;
  order: number;
  created_at: string;
  updated_at: string;
};

export type BacklogType = TaskType & { status: "Backlog" };
export type PomodoroType = TaskType & { status: "Pomodoro" };

export type PomodoroFocusType = "Focus" | "Rest";
export type PomodoroTimerState = "PLAY" | "PAUSE";

export type CreateDto = {
  title: string;
  order: number;
};

export type EditPomodoroDto = {
  id?: string;
  est?: number;
  act?: number;
};
