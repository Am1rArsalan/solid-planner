import { Accessor, Component, createSignal, For, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";

import styles from "./App.module.css";
import Calender from "./components/Calender";

function createTask(title: string) {
  return {
    title,
  };
}

function createPomodoroItem(title: string) {
  return {
    title,
    active: false,
  };
}

type TaskType = {
  title: string;
};

type PomodoroType = {
  title: string;
  active: boolean;
};

export default function () {
  const [state, setState] = createStore<{
    backlog: TaskType[];
    pomodors: PomodoroType[];
  }>({ backlog: [], pomodors: [] });

  const [selected, setSelected] = createSignal<null | PomodoroType>(null);

  const handleAdd = (task: string) => {
    if (!task.length) return;

    setState({
      ...state,
      backlog: [...state.backlog, createTask(task)],
    });
  };

  const handleRemove = (task: string) => {
    setState({
      ...state,
      backlog: state.backlog.filter((item) => item.title != task),
    });
  };

  const handleMove = (title: string) => {
    setState({
      ...state,
      backlog: state.backlog.filter((item) => item.title != title),
      pomodors: [...state.pomodors, createPomodoroItem(title)],
    });
  };

  const handleActive = (title: string) => {
    const newPomodoros = state.pomodors.map((item) => {
      if (item.title === title) {
        return {
          ...item,
          active: true,
        };
      }
      return { ...item, active: false };
    });
    const selectedPomodoroIndex = newPomodoros.findIndex((item) => item.active);
    const activePomodoroTask =
      selectedPomodoroIndex !== -1 ? newPomodoros[selectedPomodoroIndex] : null;
    setSelected(activePomodoroTask);
    setState({
      ...state,
      pomodors: newPomodoros,
    });
  };

  return (
    <div class={styles.App}>
      <div class={styles.Tasks}>
        <BackLog handleAdd={handleAdd} handleRemove={handleRemove}>
          <For each={state.backlog}>
            {(task) => (
              <BacklogItem title={task.title}>
                <button onClick={() => handleMove(task.title)}>{"➡"}</button>
                <button onClick={() => handleRemove(task.title)}>{"X"}</button>
              </BacklogItem>
            )}
          </For>
        </BackLog>
        <Pomodoro selected={selected}>
          <For each={state.pomodors}>
            {(item) => (
              <PomodoroItem
                isActive={item.active}
                title={item.title}
                handleActive={handleActive}
              >
                <button>{"↩"}</button>
                <button>{"⬇"}</button>
                <button>{"✔"}</button>
              </PomodoroItem>
            )}
          </For>
        </Pomodoro>
      </div>
      <div class={styles.Calender}>
        <Calender />
      </div>
    </div>
  );
}

/////////////////////////////////////////////// Pomodoro
type PomodoroFocusType = "Focus" | "Rest";
type PomodoroTimerState = "PLAY" | "PAUSE";

const timeMap = new Map<PomodoroFocusType, number>([
  ["Focus", 25],
  ["Rest", 15],
]);

const Pomodoro: Component<{ selected: Accessor<PomodoroType | null> }> = ({
  children,
  selected,
}) => {
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

const PomodoroItem: Component<{
  title: string;
  handleActive: (title: string) => void;
  isActive: boolean;
}> = ({ isActive, title, children, handleActive }) => {
  const pomodoroClass = isActive
    ? [styles.Task, styles.ActivePomodoro].join(" ")
    : styles.Task;

  return (
    <div class={pomodoroClass} onClick={() => handleActive(title)}>
      <div class={styles.TaskTitle}>{title}</div>
      <div class={styles.TaskAction}>{children} </div>
    </div>
  );
};

///////////////////////////////////////// BackLog

const BackLog: Component<{
  handleAdd: (value: string) => void;
  handleRemove: (value: string) => void;
}> = ({ children, handleAdd }) => {
  const [state, setState] = createStore<{
    value: string;
    isSubmitting: boolean;
  }>({
    value: "",
    isSubmitting: false,
  });

  const handleChangeValue = (
    ev: Event & { currentTarget: HTMLInputElement; target: Element }
  ) => {
    setState({
      value: ev.currentTarget.value,
    });
  };

  return (
    <div class={styles.Backlog}>
      <h2> Backlog </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd(state.value);
          setState({
            value: "",
            isSubmitting: false,
          });
        }}
      >
        <input
          value={state.value}
          onChange={handleChangeValue}
          class={styles.TaskInput}
        />
      </form>
      {children}
    </div>
  );
};

const BacklogItem: Component<{ title: string }> = ({ title, children }) => {
  return (
    <div class={styles.Task}>
      <div class={styles.TaskTitle}>{title}</div>
      <div class={styles.TaskAction}>{children}</div>
    </div>
  );
};
