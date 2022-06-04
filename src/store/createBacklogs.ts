// FIXME => never & any
import { createResource } from "solid-js";
import type { Resource } from "solid-js";
import { SetStoreFunction } from "solid-js/store";
import { StoreType } from "../types/store";
import { BacklogType, CreateDto, PomodoroType } from "../types/pomodoro";
import { fetchBacklogs, addBacklog } from "../api/backlogs";
import { changeOrder, removePomodoro } from "../api/shared";
import { Actions } from ".";
import { ChangeOrderDto } from "../types/shared";

export interface BacklogActions {
  //
}

// TODO: remove never
export default function createBacklogs(
  actions: any,
  state: StoreType,
  setState: SetStoreFunction<StoreType>
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

    addPendingItem(data: { title: string; creationTime: string }) {
      mutate((prev) => [
        ...prev,
        {
          current: 0,
          done: false,
          end: 0,
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

    revalidateAddedItem(addedTask: any, creationTime: string) {
      mutate((prev) =>
        prev.map((item) => {
          if (item.created_at === creationTime) {
            return addedTask;
          }
          return item;
        })
      );
    },

    remove(id: string) {
      return removePomodoro(id, state.token);
    },

    changeOrder(data: ChangeOrderDto) {
      return changeOrder(data, state.token);
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
