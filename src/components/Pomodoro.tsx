import { createSortable } from "@thisbeyond/solid-dnd";
import { Accessor, Component, onCleanup, Show, ParentProps } from "solid-js";
import { createStore } from "solid-js/store";
import { timeMap } from "../constants/pomodoro";
import { useStore } from "../store";
import {
  PomodoroFocusType,
  PomodoroTimerState,
  PomodoroType,
} from "../types/pomodoro";
import styles from "./Pomodoro.module.css";

export const PomodoroContainer: Component<ParentProps> = ({ children }) => {
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
        await editPomodoro();
        loadPomodoros();
      } catch (error) {
        /// FIXME : set error///
      }
    }
  };

  // TODO : see if can be optimize
  const interval = setInterval(() => {
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
          audio.play();
        } else {
          clone.time.minutes = clone.time.minutes - 1;
        }
      }
      setState({ ...clone });
    }
  }, 10);

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

type PomodoroItemProps = ParentProps<
  PomodoroType & {
    handleActive: () => void;
    activePomodoro: Accessor<PomodoroType | null>;
  }
>;

export const PomodoroItemContainer: Component<PomodoroItemProps> = ({
  _id,
  title,
  children,
  handleActive,
  activePomodoro,
  done,
}) => {
  return (
    <div
      class={
        activePomodoro()?._id == _id
          ? !done
            ? [styles.PomodoroItem, "sortable", styles.ActivePomodoro].join(" ")
            : [
                styles.Done,
                styles.PomodoroItem,
                "sortable",
                styles.ActivePomodoro,
              ].join(" ")
          : !done
          ? [styles.PomodoroItem, "sortable"].join(" ")
          : [styles.Done, styles.PomodoroItem, "sortable"].join(" ")
      }
      onClick={handleActive}
    >
      <div class={styles.PomodoroTitle}>{title}</div>
      <div class={styles.PomodoroItemAction}>{children} </div>
    </div>
  );
};

export const SortablePomodoroItem: Component<PomodoroItemProps> = ({
  _id,
  title,
  children,
  handleActive,
  activePomodoro,
  done,
  order,
}) => {
  const sortable = createSortable(`${_id}-${order}`);
  return (
    <div
      use:sortable
      class={
        activePomodoro()?._id == _id
          ? !done
            ? [styles.PomodoroItem, "sortable", styles.ActivePomodoro].join(" ")
            : [
                styles.Done,
                styles.PomodoroItem,
                "sortable",
                styles.ActivePomodoro,
              ].join(" ")
          : !done
          ? [styles.PomodoroItem, "sortable"].join(" ")
          : [styles.Done, styles.PomodoroItem, "sortable"].join(" ")
      }
      onClick={handleActive}
    >
      <div class={styles.PomodoroTitle}>{title}</div>
      <div class={styles.PomodoroItemAction}>{children}</div>
    </div>
  );
};
