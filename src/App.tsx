import { Component } from "solid-js";
import styles from "./App.module.css";
import Backlogs from "./components/Backlogs";
import Pomodoros from "./components/Pomodoros";
import { useStore } from "./store";
import { TaskType } from "./types/pomodoro";

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
    let removedItemIndex, removedItem: TaskType | undefined;
    if (currentStatus === "Pomodoro") {
      removedItemIndex = pomodoros()?.findIndex((item) => item._id == id);
      if (removedItemIndex == -1) return;
      removedItem = pomodoros()[removedItemIndex];
      moveItemAndOrderItems(id);
      addMovedPomodoroItem(removedItem);
    } else {
      removedItemIndex = backlogs()?.findIndex((item) => item._id == id);
      if (removedItemIndex == -1) return;
      removedItem = backlogs()[removedItemIndex];
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
        addMovedBacklogItem(removedItem);
        moveBacklogItemAndReOrder(id);
      } else {
        addMovedPomodoroItem(removedItem);
        moveItemAndOrderItems(id);
      }
    }
  };

  return (
    <div
      class={
        pomodoroState() == "Focus"
          ? styles.App
          : [styles.App, styles.BlueApp].join(" ")
      }
    >
      <div class={styles.Tasks}>
        <Backlogs move={handleMove} />
        <Pomodoros move={handleMove} />
      </div>
    </div>
  );
};

export default App;
