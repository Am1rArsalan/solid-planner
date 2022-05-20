import { Accessor, Component, onCleanup, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { timeMap } from "../constants/pomodoro";
import {
  PomodoroFocusType,
  PomodoroTimerState,
  PomodoroType,
} from "../types/pomodoro";
import styles from "./Pomodoro.module.css";

type Props = {
  selected: Accessor<PomodoroType | null>;
  pomodoro: Accessor<PomodoroFocusType>;
  changePomodoroState: (value: PomodoroFocusType) => void;
};

export const Pomodoro: Component<Props> = ({
  children,
  selected,
  pomodoro,
  changePomodoroState,
}) => {
  const [state, setState] = createStore<{
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
    time: {
      minutes: timeMap.get("Focus") as number,
      seconds: 0,
    },
    error: {
      status: false,
      message: "",
    },
  });

  const handleRun = () => {
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
  };

  const interval = setInterval(() => {
    if (state.timerState == "PLAY") {
      const clone = { ...state, time: { ...state.time } };
      if (clone.time.seconds - 1 > 0) {
        clone.time.seconds = clone.time.seconds - 1;
      } else {
        clone.time.seconds = clone.time.minutes - 1 >= 0 ? 59 : 0;

        if (clone.time.minutes - 1 < 0) {
          changePomodoroState(pomodoro() == "Focus" ? "Rest" : "Focus");
          clone.time.minutes = timeMap.get(pomodoro()) as number;
          clone.timerState = "PAUSE";
          const audio = new Audio(
            "https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3"
          );
          audio.play();
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
          <Show
            when={state.time.minutes > 9}
            fallback={`0${state.time.minutes}`}
          >
            {state.time.minutes}
          </Show>
          :
          <Show
            when={state.time.seconds > 9}
            fallback={`0${state.time.seconds}`}
          >
            {state.time.seconds}
          </Show>
        </div>
        <div class={styles.TimerActions}>
          <button class={styles.TimerActionButton} onClick={handleRun}>
            <Show when={state.timerState === "PAUSE"} fallback={"⏹"}>
              ▶
            </Show>
          </button>
        </div>
      </div>
      {children}
    </div>
  );
};

type PomodoroItemProps = {
  title: string;
  handleActive: (title: string) => void;
  isActive: boolean;
};

export const PomodoroItem: Component<PomodoroItemProps> = ({
  isActive,
  title,
  children,
  handleActive,
}) => {
  const pomodoroClass = isActive
    ? [styles.PomodoroItem, styles.ActivePomodoro].join(" ")
    : styles.PomodoroItem;

  return (
    <div class={pomodoroClass} onClick={() => handleActive(title)}>
      <div class={styles.PomodoroTitle}>{title}</div>
      <div class={styles.PomodoroItemAction}>{children} </div>
    </div>
  );
};