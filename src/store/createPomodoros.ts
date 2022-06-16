import { createResource } from "solid-js";
import type { Resource } from "solid-js";
import { StoreType } from "../types/store";
import { BacklogType, PomodoroType } from "../types/pomodoro";
import { Actions } from "./";
import { ChangeOrderDto, ChangeTaskStatusDto } from "../types/shared";
import { Agent } from "./createAgent";

export interface PomodorosActions {
  loadPomodoros(): PomodoroType[] | Promise<PomodoroType[]> | undefined | null;
  mutatePomodoros(data: PomodoroType[]): PomodoroType[];
  remove(id: string): Promise<PomodoroType>;
  clientRemove(id: string): void;
  clientRemoveRevalidate(removedItem: PomodoroType): void;
  makeTaskDone(id: string): Promise<PomodoroType[]>;
  clientFilterDoneTask(id: string): void;
  clientFilterDoneTaskRevalidate(id: string): void;
  moveItemAndOrderItems(id: string): void;
  addMovedBacklogItem(movedItem: BacklogType): void;
  changeTaskStatus(
    id: string,
    data: ChangeTaskStatusDto
  ): Promise<PomodoroType[]>;
  changePomodorosOrder(data: ChangeOrderDto): Promise<PomodoroType[]>;
}

export default function createPomodoros(
  actions: Actions,
  state: StoreType,
  agent: Agent
): Resource<PomodoroType[]> {
  const [pomodoros, { mutate, refetch }] = createResource<PomodoroType[]>(
    async () => await agent.pomodoros.fetchPomodoros(),
    {
      initialValue: [],
    }
  );

  Object.assign<Actions, PomodorosActions>(actions, {
    changePomodorosOrder(data: ChangeOrderDto) {
      return agent.tasks.changeOrder<PomodoroType>(data);
    },
    loadPomodoros() {
      return refetch();
    },
    mutatePomodoros(data: PomodoroType[]) {
      return mutate(data);
    },
    remove(id: string) {
      return agent.tasks.remove<PomodoroType>(id);
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
    makeTaskDone(id: string) {
      return agent.pomodoros.doneTask(id);
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
      return agent.pomodoros.changeTaskStatus(id, data);
    },
  });
  return pomodoros;
}
