// FIXME => never & any
import { createResource } from "solid-js";
import type { Resource } from "solid-js";
import { SetStoreFunction } from "solid-js/store";
import { StoreType } from "../types/store";
import { PomodoroType } from "../types/pomodoro";
import { fetchBacklogs } from "../api/backlogs";

// TODO: remove never
export default function createBacklogs(
  actions: any,
  state: StoreType,
  setState: SetStoreFunction<StoreType>
): Resource<PomodoroType[]> {
  const [backlogs, { mutate: backlogsMutate, refetch: refetchBacklogs }] =
    createResource<PomodoroType[]>(
      async () => await fetchBacklogs(state.token),
      {
        initialValue: [],
      }
    );

  Object.assign(actions, {
    loadBacklogs() {
      return refetchBacklogs();
    },
    mutateBacklogs(data: PomodoroType[]) {
      return backlogsMutate(data);
    },
    addBacklog() {},
  });

  return backlogs;
}
