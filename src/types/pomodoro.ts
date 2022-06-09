export type TaskStatusType = "Backlog" | "Pomodoro";

export type TaskBaseType = {
  _id: string;
  title: string;
  current: number;
  end: number;
  done: boolean;
  order: number;
  created_at: string;
  updated_at: string;
};

export type TaskType = TaskBaseType & { status: TaskStatusType };
export type BacklogType = TaskBaseType & { status: "Backlog" };
export type PomodoroType = TaskBaseType & { status: "Pomodoro" };

export type PomodoroFocusType = "Focus" | "Rest";
export type PomodoroTimerState = "PLAY" | "PAUSE";

export type CreateDto = {
  title: string;
  order: number;
};

export type CreatePendingItemDto = {
  title: string;
  creationTime: string;
};

export type EditPomodoroDto = {
  id: string;
  est: number;
  act: number;
  title: string;
};
