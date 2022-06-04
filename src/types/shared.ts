import { PomodoroType, TaskType } from "./pomodoro";

export type ChangeOrderDto = {
  newOrder: PomodoroType[];
  status: "Backlog" | "Pomodoro";
};

export type ChangeTaskStatusDto = {
  status: "Backlog" | "Pomodoro";
  order: number;
  currentOrders: TaskType[];
};
