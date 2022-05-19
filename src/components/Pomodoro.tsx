import { Accessor, Component, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { PomodoroType } from "../types/pomodoro";
import styles from "./Pomodoro.module.css";

type PomodoroFocusType = "Focus" | "Rest";
type PomodoroTimerState = "PLAY" | "PAUSE";

const timeMap = new Map<PomodoroFocusType, number>([
  ["Focus", 25],
  ["Rest", 15],
]);

export const Pomodoro: Component<{
  selected: Accessor<PomodoroType | null>;
}> = ({ children, selected }) => {
  const [state, setState] = createStore<{
    pomodoro: PomodoroFocusType;
    timerState: PomodoroTimerState;
    time: {
      minutes: number;
      seconds: number;
    };
    error: {
      status: boolean;
      message: string;
    };
  }>({
    timerState: "PAUSE",
    pomodoro: "Focus",
    time: {
      minutes: timeMap.get("Focus") as number,
      seconds: 0,
    },
    error: {
      status: false,
      message: "",
    },
  });

  const interval = setInterval(() => {
    if (state.timerState == "PLAY") {
      const clone = { ...state, time: { ...state.time } };
      if (clone.time.seconds - 1 > 0) {
        clone.time.seconds = clone.time.seconds - 1;
      } else {
        clone.time.seconds = clone.time.minutes - 1 >= 0 ? 59 : 0;

        if (clone.time.minutes - 1 < 0) {
          clone.pomodoro = clone.pomodoro == "Focus" ? "Rest" : "Focus";
          clone.time.minutes = timeMap.get(clone.pomodoro) as number;
          clone.timerState = "PAUSE";
          // TODO: notify user (make noise)
        } else {
          clone.time.minutes = clone.time.minutes - 1;
        }
      }

      setState({ ...clone });
    }
  }, 1000);

  onCleanup(() => clearInterval(interval));

  return (
    <div class={styles.Pomodoro}>
      <h2> pomodoro </h2>
      <div class={styles.PomodoroTimer}>
        <div class={styles.Timer}>
          {state.time.minutes > 9
            ? state.time.minutes
            : `0${state.time.seconds}`}
          :
          {state.time.seconds > 9
            ? state.time.seconds
            : `0${state.time.seconds}`}
        </div>
        <div class={styles.TimerActions}>
          <button
            class={styles.TimerActionButton}
            onClick={() => {
              if (selected()) {
                selected()?.active &&
                  setState({
                    ...state,
                    timerState: state.timerState === "PLAY" ? "PAUSE" : "PLAY",
                    error: {
                      status: false,
                      message: "",
                    },
                  });
                return;
              }

              setState({
                ...state,
                error: {
                  status: true,
                  message: "Please select a task",
                },
              });
            }}
          >
            {state.timerState === "PAUSE" ? "▶" : "⏹"}
          </button>
        </div>
      </div>
      {children}
    </div>
  );
};

export const PomodoroItem: Component<{
  title: string;
  handleActive: (title: string) => void;
  isActive: boolean;
}> = ({ isActive, title, children, handleActive }) => {
  const pomodoroClass = isActive
    ? [styles.Task, styles.ActivePomodoro].join(" ")
    : styles.Task;

  return (
    <div class={pomodoroClass} onClick={() => handleActive(title)}>
      <div class={styles.PomodoroTitle}>{title}</div>
      <div class={styles.TaskAction}>{children} </div>
    </div>
  );
};
