import { createSignal } from "solid-js";
import { SetStoreFunction } from "solid-js/store";
import { StoreType } from "../types/store";
import { PomodoroFocusType, PomodoroType } from "../types/pomodoro";
import { Actions } from ".";
import { editPomodoro } from "../api/pomodoro";

// TODO
export interface PomodoroActions {
  //
}

export default function createPomodoro(
  actions: any,
  state: StoreType,
  setState: SetStoreFunction<StoreType>
) {
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
    editPomodoro() {
      return editPomodoro(
        {
          id: activePomodoro()?._id,
          est: activePomodoro()?.end,
          // FIXME : fix the type (it should not be (as ...))
          // should infer the type
          act: (activePomodoro() as PomodoroType).current + 1,
        },
        state.token
      );
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
