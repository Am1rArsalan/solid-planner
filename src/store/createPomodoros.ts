import { createResource } from "solid-js";
import type { Resource } from "solid-js";
import { StoreType } from "../types/store";
import { BacklogType, PomodoroType } from "../types/pomodoro";
import { fetchPomodoros, makeTaskDone } from "../api/pomodoros";
import { changeOrder, changeTaskStatus, removePomodoro } from "../api/shared";
import { Actions } from "./";
import { ChangeOrderDto, ChangeTaskStatusDto } from "../types/shared";

// TODO : CHECK THIS AGAIN
export interface PomodorosActions {
  loadPomodoros(): PomodoroType[] | Promise<PomodoroType[]> | undefined | null;
  mutatePomodoros(data: PomodoroType[]): PomodoroType[];
  remove(id: string): Promise<PomodoroType>;
  clientRemove(id: string): void;
  clientRemoveRevalidate(removedItem: PomodoroType): void;
  changeOrder(data: ChangeOrderDto): Promise<PomodoroType[]>;
  makeTaskDone(id: string): Promise<PomodoroType[]>;
  clientFilterDoneTask(id: string): void;
  clientFilterDoneTaskRevalidate(id: string): void;
  moveItemAndOrderItems(id: string): void;
  addMovedBacklogItem(movedItem: BacklogType): void;
  changeTaskStatus(
    id: string,
    data: ChangeTaskStatusDto
  ): Promise<PomodoroType[]>;
}

export default function createPomodoros({
  actions,
  state,
}: {
  actions: Actions;
  state: StoreType;
}): Resource<PomodoroType[]> {
  const [pomodoros, { mutate, refetch }] = createResource<PomodoroType[]>(
    async () => await fetchPomodoros(state.token),
    {
      initialValue: [],
    }
  );

  Object.assign<Actions, PomodorosActions>(actions, {
    loadPomodoros() {
      return refetch();
    },
    mutatePomodoros(data: PomodoroType[]) {
      return mutate(data);
    },
    remove(id: string) {
      return removePomodoro(id, state.token);
    },
    clientRemove(id: string) {
      if (id === state.activePomodoro()?._id) {
        actions.changeActivePomodoro(null);
      }
      mutate((prev) => {
        return prev?.filter((item) => item._id !== id);
      });
    },
    clientRemoveRevalidate(removedItem: PomodoroType) {
      mutate((prev) => {
        return [...prev, removedItem];
      });
    },
    changeOrder(data: ChangeOrderDto) {
      return changeOrder<PomodoroType>(data, state.token);
    },
    makeTaskDone(id: string) {
      return makeTaskDone(id, state.token);
    },
    clientFilterDoneTask(id: string) {
      mutate((prev) => {
        return prev.map((item) => {
          if (item._id === id) {
            return {
              ...item,
              done: !item.done,
            };
          }
          return item;
        });
      });
    },
    clientFilterDoneTaskRevalidate(id: string) {
      mutate((prev) => {
        return prev.map((item) => {
          if (item._id === id) {
            return {
              ...item,
              done: !item.done,
            };
          }
          return item;
        });
      });
    },
    moveItemAndOrderItems(id: string) {
      mutate((prev) => {
        return prev
          ?.filter((item) => item._id !== id)
          .map((item, order) => ({ ...item, order: order + 1 }));
      });
    },
    addMovedBacklogItem(movedItem: BacklogType) {
      mutate((prev) => {
        return [
          ...prev,
          { ...movedItem, status: "Pomodoro", order: prev.length },
        ];
      });
    },
    changeTaskStatus(id: string, data: ChangeTaskStatusDto) {
      return changeTaskStatus(id, data, state.token);
    },
  });
  return pomodoros;
}
