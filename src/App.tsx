import { createSignal, For } from "solid-js";
import { createStore } from "solid-js/store";

import styles from "./App.module.css";
import { BackLog, BacklogItem } from "./components/Backlog";
import Calender from "./components/Calender";
import { Pomodoro, PomodoroItem } from "./components/Pomodoro";
import { createTask } from "./store/createBacklog";
import { createPomodoroItem } from "./store/createPomodoro";
import { PomodoroType } from "./types/pomodoro";

type TaskType = {
  title: string;
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
