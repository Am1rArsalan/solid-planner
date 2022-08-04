import { BacklogType, PomodoroFocusType, PomodoroType } from "./pomodoro";
import { UserType } from "./user";

export type StoreType = {
  readonly token: string | null;
  readonly backlogs: BacklogType[];
  readonly pomodoros: PomodoroType[];
  readonly pomodoroState: PomodoroFocusType;
  readonly activePomodoro: PomodoroType | null;
  readonly user: UserType | null;
};
