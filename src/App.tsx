import type { Component } from "solid-js";

import styles from "./App.module.css";

const App: Component = () => {
  return (
    <div class={styles.App}>
      <div class={styles.calender} />
      <div class={styles.tasks}>
        <div class={styles.backlog}> backlog </div>
        <div class={styles.pomodoro}> pomodoro </div>
      </div>
    </div>
  );
};

export default App;
