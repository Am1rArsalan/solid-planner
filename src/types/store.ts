import { Resource } from "solid-js";
import { PomodoroType } from "./pomodoro";

export type StoreType = {
  readonly token: string | null;
  readonly backlogs: Resource<PomodoroType[]>;
};
