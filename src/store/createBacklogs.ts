import { createResource } from "solid-js";
import type { Resource } from "solid-js";
import {
  BacklogType,
  CreateDto,
  CreatePendingItemDto,
  PomodoroType,
} from "../types/pomodoro";
import { ChangeOrderDto } from "../types/shared";
import { Actions } from ".";
import { Agent } from "./createAgent";

export interface BacklogActions {
  loadBacklogs(): BacklogType[] | Promise<BacklogType[]> | undefined | null;
  mutateBacklogs(data: BacklogType[]): BacklogType[];
  addBacklog(data: CreateDto): Promise<BacklogType>;
  addPendingItem(data: CreatePendingItemDto): void;
  removePendingItem(creationTime: string): void;
  revalidateAddedItem(addedTask: BacklogType, creationTime: string): void;
  removeBacklog(id: string): Promise<BacklogType>;
  changeBacklogsOrder(data: ChangeOrderDto): Promise<BacklogType[]>;
  moveBacklogItemAndReOrder(id: string): void;
  addMovedPomodoroItem(movedItem: PomodoroType): void;
}

export default function createBacklogs(
  actions: Actions,
  agent: Agent
): Resource<BacklogType[]> {
  const [backlogs, { mutate, refetch }] = createResource<BacklogType[]>(
    async () => await agent.backlogs.fetchBacklogs(),
    {
      initialValue: [],
    }
  );

  Object.assign<Actions, BacklogActions>(actions, {
    loadBacklogs() {
      return refetch();
    },
    mutateBacklogs(data: BacklogType[]) {
      return mutate(data);
    },
    addBacklog(data: CreateDto) {
      return agent.backlogs.addBacklog(data);
    },
    addPendingItem(data: CreatePendingItemDto) {
      mutate((prev) => [
        ...prev,
        {
          current: 0,
          done: false,
          end: data.est,
          isRemoved: false,
          status: "Backlog",
          title: data.title,
          updated_at: data.creationTime,
          created_at: data.creationTime,
          order: prev.length + 1,
          _id: "Pending",
        },
      ]);
    },
    removePendingItem(creationTime: string) {
      mutate((prev) => prev.filter((item) => item.created_at !== creationTime));
    },
    revalidateAddedItem(addedTask: BacklogType, creationTime: string) {
      mutate((prev) =>
        prev.map((item) => {
          if (item.created_at === creationTime) {
            return addedTask;
          }
          return item;
        })
      );
    },
    removeBacklog(id: string) {
      return agent.tasks.remove<BacklogType>(id);
    },
    changeBacklogsOrder(data: ChangeOrderDto) {
      return agent.tasks.changeOrder<BacklogType>(data);
    },
    moveBacklogItemAndReOrder(id: string) {
      mutate((prev) => {
        return prev
          ?.filter((item) => item._id !== id)
          .map((item, order) => ({ ...item, order: order + 1 }));
      });
    },
    addMovedPomodoroItem(movedItem: PomodoroType) {
      mutate((prev) => {
        return [
          ...prev,
          { ...movedItem, status: "Backlog", order: prev.length },
        ];
      });
    },
  });

  return backlogs;
}
