import { Component } from "solid-js";
import styles from "./App.module.css";
import Backlogs from "./components/Backlogs";
import Pomodoros from "./components/Pomodoros";
import Header from "./components/Header";
import { classNames } from "./components/UI/utils/classNames";
import { useStore } from "./store";

const App: Component = () => {
  const [store, { handleMove }] = useStore();

  return (
    <div class={styles.App}>
      <Header />
      <div class={styles.Content}>
        <Backlogs move={handleMove} />
        <Pomodoros move={handleMove} />
        <div
          class={
            store.pomodoroState === "Focus"
              ? styles.Background
              : classNames(styles.Background, styles.BlueBackground)
          }
        />
      </div>
    </div>
  );
};

export default App;
