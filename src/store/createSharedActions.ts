import { StoreType } from "../types/store";
import { Actions } from ".";
import { BacklogType, PomodoroType, TaskType } from "../types/pomodoro";
import { PomodorosAgent } from "./createAgent";

export interface SharedActions {
  handleMove(id: string, currentStatus: "Backlog" | "Pomodoro"): void;
}

export default function createSharedActions(
  actions: Actions,
  state: StoreType,
  agent: PomodorosAgent
) {
  Object.assign<Actions, SharedActions>(actions, {
    handleMove: async (id: string, currentStatus: "Backlog" | "Pomodoro") => {
      if (id.length === 0) return;
      let removedIndex, removedItem: TaskType | undefined;
      if (currentStatus === "Pomodoro") {
        removedIndex = state.pomodoros?.findIndex((item) => item._id == id);
        if (removedIndex == -1) return;
        removedItem = state.pomodoros[removedIndex];
        actions.moveItemAndOrderItems(id);
        actions.addMovedPomodoroItem(removedItem);
      } else {
        removedIndex = state.backlogs?.findIndex((item) => item._id == id);
        if (removedIndex == -1) return;
        removedItem = state.backlogs[removedIndex];
        actions.moveBacklogItemAndReOrder(id);
        actions.addMovedBacklogItem(removedItem);
      }
      try {
        await agent.changeTaskStatus(id, {
          status: currentStatus,
          order:
            currentStatus == "Backlog"
              ? state.pomodoros.length
              : state.backlogs.length,
          currentOrders:
            currentStatus == "Backlog" ? state.backlogs : state.pomodoros,
        });
      } catch (error) {
        if (currentStatus === "Pomodoro") {
          actions.addMovedBacklogItem(removedItem as BacklogType);
          actions.moveBacklogItemAndReOrder(id);
        } else {
          actions.addMovedPomodoroItem(removedItem as PomodoroType);
          actions.moveItemAndOrderItems(id);
        }
      }
    },
  });
}
