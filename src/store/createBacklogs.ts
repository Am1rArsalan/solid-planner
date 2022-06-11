import { createResource } from "solid-js";
import type { Resource } from "solid-js";
import { StoreType } from "../types/store";
import {
  BacklogType,
  CreateDto,
  CreatePendingItemDto,
  PomodoroType,
} from "../types/pomodoro";
import { fetchBacklogs, addBacklog } from "../api/backlogs";
import { changeOrder, removePomodoro } from "../api/shared";
import { ChangeOrderDto } from "../types/shared";
import { Actions } from ".";

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
  state: StoreType
): Resource<BacklogType[]> {
  const [backlogs, { mutate, refetch }] = createResource<BacklogType[]>(
    async () => await fetchBacklogs(state.token),
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
      return addBacklog(data, state.token);
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
      return removePomodoro<BacklogType>(id, state.token);
    },
    changeBacklogsOrder(data: ChangeOrderDto) {
      return changeOrder<BacklogType>(data, state.token);
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
