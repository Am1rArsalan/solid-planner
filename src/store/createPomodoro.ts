import { createSignal } from "solid-js";
import { PomodoroFocusType, PomodoroType } from "../types/pomodoro";
import { Actions } from "./";
import { PomodoroAgent } from "./createAgent";

export interface PomodoroActions {
  changePomodoroStatus(value: PomodoroFocusType): void;
  editPomodoro(
    id: string,
    end: number,
    act: number,
    title?: string
  ): Promise<PomodoroType>;
  changeActivePomodoro(activeItem: PomodoroType | null): void;
  cycleFocus(): void;
}

export default function createPomodoro(actions: Actions, agent: PomodoroAgent) {
  const [pomodoroState, setPomodoroState] =
    createSignal<PomodoroFocusType>("Focus");
  const selectedPomodoro = localStorage.getItem("activePomodoro");
  const [activePomodoro, setActivePomodoro] = createSignal<PomodoroType | null>(
    selectedPomodoro !== null ? JSON.parse(selectedPomodoro) : null
  );

  Object.assign<Actions, PomodoroActions>(actions, {
    changePomodoroStatus(value: PomodoroFocusType) {
      setPomodoroState(value);
    },
    editPomodoro(id: string, end: number, act: number, title?: string) {
      return agent.editPomodoro({
        id: id,
        est: end,
        act: act,
        title: title ? title : (activePomodoro()?.title as string),
      });
    },
    changeActivePomodoro(activeItem: PomodoroType | null) {
      setActivePomodoro(activeItem);
      activeItem
        ? localStorage.setItem(
            "activePomodoro",
            JSON.stringify(activePomodoro())
          )
        : localStorage.removeItem("activePomodoro");
    },
    cycleFocus() {
      localStorage.setItem("activePomodoro", JSON.stringify(activePomodoro()));
      setActivePomodoro((prev) => {
        if (prev) {
          return { ...prev, current: prev.current + 1 };
        }
        return prev;
      });
      localStorage.setItem("activePomodoro", JSON.stringify(activePomodoro()));
    },
  });

  return {
    pomodoroState,
    activePomodoro,
  };
}
