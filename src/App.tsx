import styles from "./App.module.css";
import Backlogs from "./components/Backlogs";
import Pomodoros from "./components/Pomodoros";
import Header from "./components/Header";
import { Background } from "./components/UI/background";
import { useStore } from "./store";

function App() {
  const [store, { handleMove }] = useStore();

  return (
    <div class={styles.App}>
      <Header />
      <div class={styles.Content}>
        <Backlogs move={handleMove} />
        <Pomodoros move={handleMove} />
      </div>
      <Background pomodoroState={store.pomodoroState} />
    </div>
  );
}

export default App;
