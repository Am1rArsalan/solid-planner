import { TaskType } from "./pomodoro";

export type ChangeOrderDto = {
  orders: TaskType[];
  status: "Backlog" | "Pomodoro";
};

export type ChangeTaskStatusDto = {
  status: "Backlog" | "Pomodoro";
  order: number;
  currentOrders: TaskType[];
};
