import { Component } from "solid-js";
import styles from "./App.module.css";
import Backlogs from "./components/Backlogs";
import Pomodoros from "./components/Pomodoros";
import { Button } from "./components/UI/button";
import { classNames } from "./components/UI/utils/classNames";
import { useStore } from "./store";
import { BacklogType, PomodoroType, TaskType } from "./types/pomodoro";

const App: Component = () => {
  const [
    { pomodoroState, pomodoros, backlogs },
    {
      moveItemAndOrderItems,
      addMovedPomodoroItem,
      addMovedBacklogItem,
      moveBacklogItemAndReOrder,
      changeTaskStatus,
    },
  ] = useStore();

  const handleMove = async (
    id: string,
    currentStatus: "Backlog" | "Pomodoro"
  ) => {
    if (id.length === 0) return;
    let removedIndex, removedItem: TaskType | undefined;
    if (currentStatus === "Pomodoro") {
      removedIndex = pomodoros()?.findIndex((item) => item._id == id);
      if (removedIndex == -1) return;
      removedItem = pomodoros()[removedIndex];
      moveItemAndOrderItems(id);
      addMovedPomodoroItem(removedItem);
    } else {
      removedIndex = backlogs()?.findIndex((item) => item._id == id);
      if (removedIndex == -1) return;
      removedItem = backlogs()[removedIndex];
      moveBacklogItemAndReOrder(id);
      addMovedBacklogItem(removedItem);
    }

    try {
      await changeTaskStatus(id, {
        status: currentStatus,
        order:
          currentStatus == "Backlog" ? pomodoros().length : backlogs().length,
        currentOrders: currentStatus == "Backlog" ? backlogs() : pomodoros(),
      });
    } catch (error) {
      if (currentStatus === "Pomodoro") {
        addMovedBacklogItem(removedItem as BacklogType);
        moveBacklogItemAndReOrder(id);
      } else {
        addMovedPomodoroItem(removedItem as PomodoroType);
        moveItemAndOrderItems(id);
      }
    }
  };

  return (
    <div class={styles.App}>
      <a href="http://localhost:8080/auth/google">
        <Button class={styles.SignInButton}> Sign In</Button>
      </a>
      <Backlogs move={handleMove} />
      <Pomodoros move={handleMove} />
      <div
        class={
          pomodoroState() === "Focus"
            ? styles.Background
            : classNames(styles.Background, styles.BlueBackground)
        }
      />
    </div>
  );
};

export default App;
