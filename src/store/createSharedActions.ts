import { StoreType } from "../types/store";
import { Actions } from ".";
import { BacklogType, PomodoroType, TaskType } from "../types/pomodoro";

export interface SharedActions {
  handleMove(id: string, currentStatus: "Backlog" | "Pomodoro"): void;
}

export default function createSharedActions(
  actions: Actions,
  state: StoreType
) {
  const {
    moveItemAndOrderItems,
    addMovedPomodoroItem,
    moveBacklogItemAndReOrder,
    addMovedBacklogItem,
    changeTaskStatus,
  } = actions;

  Object.assign<Actions, SharedActions>(actions, {
    handleMove: async (id: string, currentStatus: "Backlog" | "Pomodoro") => {
      if (id.length === 0) return;
      let removedIndex, removedItem: TaskType | undefined;
      if (currentStatus === "Pomodoro") {
        removedIndex = state.pomodoros()?.findIndex((item) => item._id == id);
        if (removedIndex == -1) return;
        removedItem = state.pomodoros()[removedIndex];
        moveItemAndOrderItems(id);
        addMovedPomodoroItem(removedItem);
      } else {
        removedIndex = state.backlogs()?.findIndex((item) => item._id == id);
        if (removedIndex == -1) return;
        removedItem = state.backlogs()[removedIndex];
        moveBacklogItemAndReOrder(id);
        addMovedBacklogItem(removedItem);
      }
      try {
        await changeTaskStatus(id, {
          status: currentStatus,
          order:
            currentStatus == "Backlog"
              ? state.pomodoros().length
              : state.backlogs().length,
          currentOrders:
            currentStatus == "Backlog" ? state.backlogs() : state.pomodoros(),
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
    },
  });
}
