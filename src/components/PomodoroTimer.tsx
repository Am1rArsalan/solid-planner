import {
  Component,
  createEffect,
  onCleanup,
  ParentProps,
  Show,
} from "solid-js";
import { createStore } from "solid-js/store";
import { timeMap } from "../constants/pomodoro";
import { useStore } from "../store";
import {
  PomodoroFocusType,
  PomodoroTimerState,
  PomodoroType,
} from "../types/pomodoro";
import styles from "./styles/PomodoroTimer.module.css";
import { Button } from "./UI/button";

const PomodoroTimer: Component<ParentProps> = (props) => {
  const [
    { pomodoroState, activePomodoro },
    { editPomodoro, changePomodoroStatus, cycleFocus, loadPomodoros },
  ] = useStore();

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
    if (activePomodoro()) {
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
  const handleChangePomodoroStatus = async (value: PomodoroFocusType) => {
    // FIXME(BUG): on first pomodoro focus pomodoro
    // it will increase the current counter 2 time
    if (value === "Focus") {
      changePomodoroStatus(value);
      return;
    }
    changePomodoroStatus(value);
    if (activePomodoro()) {
      cycleFocus();
      try {
        // FIXME : ...
        const data = activePomodoro() as PomodoroType;
        await editPomodoro(data._id, data.end, data.current + 1, data.title);

        loadPomodoros();
      } catch (error) {
        /// FIXME : set error///
      }
    }
  };

  let interval: number;

  createEffect(() => {
    interval = setInterval(() => {
      if (state.timerState == "PLAY") {
        const clone = { ...state, time: { ...state.time } };
        if (clone.time.seconds - 1 > 0) {
          clone.time.seconds = clone.time.seconds - 1;
        } else {
          clone.time.seconds = clone.time.minutes - 1 >= 0 ? 59 : 0;

          if (clone.time.minutes - 1 < 0) {
            handleChangePomodoroStatus(
              pomodoroState() == "Focus" ? "Rest" : "Focus"
            );
            clone.time.minutes = timeMap.get(pomodoroState()) as number;
            clone.timerState = "PAUSE";
            const audio = new Audio(
              "https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3"
            );
            //audio.play();
          } else {
            clone.time.minutes = clone.time.minutes - 1;
          }
        }
        setState({ ...clone });
      }
    }, 10);
  });

  onCleanup(() => clearInterval(interval));

  return (
    <div class={styles.Pomodoro}>
      <div class={styles.PomodoroFocusManagementWrapper}>
        <div class={styles.SelectPomodoroFocusTypeButtonsWrapper}>
          <Button class={styles.SelectPomodoroFocusTypeButton}>Pomodoro</Button>
          <Button class={styles.SelectPomodoroFocusTypeButton}>
            Short Break
          </Button>
          <Button class={styles.SelectPomodoroFocusTypeButton}>
            Long Break
          </Button>
        </div>
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
        <Button class={styles.TimerActionButton} onClick={handleRun}>
          <Show when={state.timerState === "PAUSE"} fallback={"STOP"}>
            START
          </Show>
        </Button>
      </div>
      {props.children}
    </div>
  );
};

export default PomodoroTimer;
