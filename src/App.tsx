import { createResource, createSignal, For } from "solid-js";
import { createStore } from "solid-js/store";

import styles from "./App.module.css";
import { BackLog, BacklogItem } from "./components/Backlog";
import Calender from "./components/Calender";
import { Pomodoro, PomodoroItem } from "./components/Pomodoro";
import { createTask } from "./store/createBacklogs";
import { TaskType } from "./types/backlog";
import { PomodoroFocusType, PomodoroType } from "./types/pomodoro";

const API_ROOT = "http://localhost:8000";

export default function () {
  const [backlogs, { mutate, refetch }] = createResource<TaskType[]>(
    async () => {
      const res = await (
        await fetch(`${API_ROOT}/backlogs`, {
          method: "GET",
        })
      ).json();
      return res.data;
    }
  );

  const [pomodoros, { mutate: pomodorsMutate, refetch: refetchPomodoros }] =
    createResource<PomodoroType[]>(async () => {
      const res = await (
        await fetch(`${API_ROOT}/pomodoros`, { method: "GET" })
      ).json();
      return res.data;
    });

  const [selected, setSelected] = createSignal<PomodoroType | null>(null);
  const [pomodoro, setPomodoro] = createSignal<PomodoroFocusType>("Focus");

  const handleAdd = async (task: string) => {
    if (!task.length) return;

    const res = await fetch(`${API_ROOT}/backlogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createTask(task)),
    });

    if (res.status != 201) {
      throw Error("Error in creating a backlog task");
    }
    const addedTask = (await res.json()).data;

    mutate((prev) => {
      return [addedTask, ...prev];
    });
  };

  const handleRemovePomodoro = async (id: string) => {
    if (id.length === 0) return;

    // FIXME: redo this types
    let removedItemIndex = pomodoros()?.findIndex(
      (item) => item._id == id
    ) as number;
    let removedItem = (pomodoros() as PomodoroType[])[
      removedItemIndex
    ] as PomodoroType;

    pomodorsMutate((prev) => {
      return prev?.filter((item) => item._id !== id);
    });

    const res = await fetch(`${API_ROOT}/pomodoros/${id}`, {
      method: "DELETE",
    });

    // TODO : if there was an error add the item in removedItemIndex
    if (res.status != 200) {
      pomodorsMutate((prev) => {
        return [...prev, removedItem];
      });
      throw Error("Error in removing a backlog task");
    }
  };

  const handleRemoveBacklogTask = async (id: string) => {
    if (id.length === 0) return;

    // FIXME: redo this types
    let removedItemIndex = backlogs()?.findIndex(
      (item) => item._id == id
    ) as number;
    let removedItem = (backlogs() as TaskType[])[removedItemIndex] as TaskType;

    mutate((prev) => {
      return prev?.filter((item) => item._id !== id);
    });

    const res = await fetch(`${API_ROOT}/backlogs/${id}`, {
      method: "DELETE",
    });

    // TODO : if there was an error add the item in removedItemIndex
    if (res.status != 200) {
      mutate((prev) => {
        return [...prev, removedItem];
      });
      throw Error("Error in removing a backlog task");
    }
  };

  const handleMoveToBacklogs = async (id: string) => {
    // TODO : optimistic ui
    if (id.length === 0) return;

    const res = await fetch(`${API_ROOT}/pomodoros/${id}`, {
      method: "PUT",
    });

    if (res.status != 200) {
      throw Error("Error in removing a backlog task");
    }

    pomodorsMutate((prev) => {
      return prev?.filter((item) => item._id !== id);
    });
    refetch();
  };

  const handleMoveToPomodoros = async (id: string) => {
    // TODO : optimistic ui
    if (id.length === 0) return;

    const res = await fetch(`${API_ROOT}/backlogs/${id}`, {
      method: "PUT",
    });

    if (res.status != 200) {
      throw Error("Error in removing a backlog task");
    }

    mutate((prev) => {
      return prev?.filter((item) => item._id !== id);
    });
    refetchPomodoros();
  };

  const handleActive = async (id: string) => {
    let newPomodoros = pomodoros()?.map((item) => {
      if (item._id === id) {
        return {
          ...item,
          active: true,
        };
      }
      return { ...item, active: false };
    });

    pomodorsMutate(() => {
      return newPomodoros;
    });

    const res = await fetch(`${API_ROOT}/pomodoros/${id}/active`, {
      method: "PUT",
    });

    console.log("res", res);

    if (!res.ok) {
      pomodorsMutate((prev) => {
        return prev?.map((item) => {
          if (item.active) {
            return {
              ...item,
              active: false,
            };
          }
          return item;
        });
      });
    }

    const selectedPomodoroIndex = newPomodoros?.findIndex(
      (item) => item.active
    );
    const activePomodoroTask =
      selectedPomodoroIndex !== -1 ? newPomodoros[selectedPomodoroIndex] : null;
    setSelected(activePomodoroTask);
  };

  return (
    <div
      class={
        pomodoro() == "Focus"
          ? styles.App
          : [styles.App, styles.BlueApp].join(" ")
      }
    >
      <div class={styles.Tasks}>
        <BackLog handleAdd={handleAdd}>
          <div> {backlogs.loading && "loading..."}</div>
          <For each={backlogs()}>
            {(task) => (
              <BacklogItem {...task}>
                <button onClick={() => handleMoveToPomodoros(task._id)}>
                  {"➡"}
                </button>
                <button onClick={() => handleRemoveBacklogTask(task._id)}>
                  {"X"}
                </button>
              </BacklogItem>
            )}
          </For>
        </BackLog>
        <Pomodoro
          selected={selected}
          pomodoro={pomodoro}
          changePomodoroState={(value: PomodoroFocusType) => setPomodoro(value)}
        >
          <div> {pomodoros.loading && "loading..."}</div>
          <For each={pomodoros()}>
            {(item) => (
              <PomodoroItem
                isActive={item.active}
                title={item.title}
                handleActive={() => handleActive(item._id)}
              >
                <button onClick={() => handleMoveToBacklogs(item._id)}>
                  {"⬅ "}
                </button>
                <button
                  onClick={() => console.log("modify pomodoros properties")}
                >
                  {"⬇"}
                </button>
                <button onClick={() => console.log("make task done")}>
                  {"✔"}
                </button>
                <button onClick={() => handleRemovePomodoro(item._id)}>
                  {"X"}
                </button>
              </PomodoroItem>
            )}
          </For>
        </Pomodoro>
      </div>
      <div class={styles.Calender}>
        <Calender />
      </div>
    </div>
  );
}
