import { Component, For, onCleanup } from "solid-js";
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
  };
}

type TaskType = {
  title: string;
};

type PomodoroType = {
  title: string;
};

const App: Component = () => {
  const [state, setState] = createStore<{
    backlog: TaskType[];
    pomodors: PomodoroType[];
  }>({ backlog: [], pomodors: [] });

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
        <Pomodoro>
          <For each={state.pomodors}>
            {(item) => (
              <PomodoroItem title={item.title}>
                <button> {"↩"} </button>
                <button> {"⬇"} </button>
                <button> {"✔"} </button>
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
};

////////////////////////////////////////////////////// BackLog
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

///////////////////////////////////////////// Pomodoro
type PomodoroFocusType = "Focus" | "Rest";

const timeMap = new Map<PomodoroFocusType, number>([
  ["Focus", 25],
  ["Rest", 15],
]);

const Pomodoro: Component = ({ children }) => {
  const [state, setState] = createStore<{
    activeTask: string;
    pomodoro: PomodoroFocusType;
    time: {
      minutes: number;
      seconds: number;
    };
  }>({
    activeTask: "activeTask",
    pomodoro: "Focus",
    time: {
      minutes: timeMap.get("Focus") as number,
      seconds: 0,
    },
  });

  const interval = setInterval(() => {
    if (state.time.minutes == 0 && state.time.seconds == 0) {
      setState({
        ...state,
        time: {
          minutes: state.pomodoro == "Focus" ? 15 : 25,
          seconds: 0,
        },
        pomodoro: state.pomodoro == "Focus" ? "Rest" : "Focus",
      });
    } else if (state.time.minutes == 0 && state.time.seconds > 0) {
      setState({
        ...state,
        time: {
          minutes: state.pomodoro == "Focus" ? 15 : 25,
          seconds: 0,
        },
        pomodoro: state.pomodoro == "Focus" ? "Rest" : "Focus",
      });
    }
  }, 1000);

  onCleanup(() => {
    clearInterval(interval);
  });

  return (
    <div class={styles.Pomodoro}>
      <h2> pomodoro </h2>
      <div class={styles.PomodoroTimer}>
        <div class={styles.Timer}>
          {state.time.minutes} : {state.time.seconds}
        </div>
        <div class={styles.TimerActions}>
          <button
            class={styles.TimerActionButton}
            onClick={() => console.log("play")}
          >
            ▶
          </button>
          <button
            class={styles.TimerActionButton}
            onClick={() => console.log("stop")}
          >
            ⏹
          </button>
        </div>
      </div>
      {children}
    </div>
  );
};
const PomodoroItem: Component<{ title: string }> = ({ title, children }) => {
  return (
    <div class={styles.Task}>
      <div class={styles.TaskTitle}>{title}</div>
      <div class={styles.TaskAction}>{children} </div>
    </div>
  );
};

export default App;
