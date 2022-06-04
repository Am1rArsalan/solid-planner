import { Accessor, Resource } from "solid-js";
import { BacklogType, PomodoroFocusType, PomodoroType } from "./pomodoro";

export type StoreType = {
  readonly token: string | null;
  readonly backlogs: Resource<BacklogType[]>;
  readonly pomodoros: Resource<PomodoroType[]>;
  readonly pomodoroState: Accessor<PomodoroFocusType>;
  readonly activePomodoro: Accessor<PomodoroType | null>;
};
