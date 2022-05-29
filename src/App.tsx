import {
  Accessor,
  Component,
  createResource,
  createSignal,
  For,
  ParentProps,
  Show,
} from "solid-js";
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
  const [showDetail, setShowDetail] = createSignal("");
  const selectedPomodoro = localStorage.getItem("activePomodoro");
  const [activePomodoro, setActivePomodoro] = createSignal<
    PomodoroType | undefined
  >(selectedPomodoro !== null ? JSON.parse(selectedPomodoro) : undefined);
  const [pomodoro, setPomodoro] = createSignal<PomodoroFocusType>("Focus");

  // backlogs resource
  // TODO : make own resource
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

  // pomodoros resource
  // TODO : make own resource
  const [pomodoros, { mutate: pomodorsMutate, refetch: refetchPomodoros }] =
    createResource<PomodoroType[]>(async () => {
      const res = await (
        await fetch(`${API_ROOT}/pomodoros`, { method: "GET" })
      ).json();
      return res.data;
    });

  // add task to backlogs
  // TODO : make own resource
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

  // TODO : make own resource
  // remove backlog task ( pomodoros resource)
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

  //remove backlog task ( backlogs resource )
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

  //move to backlogs ( pomodoros resource )
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

  //move to pomodoros ( backlogs resource )
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
    if (id === activePomodoro()?._id) return;
    setActivePomodoro(pomodoros()?.find((item) => item._id == id));
    activePomodoro() &&
      localStorage.setItem("activePomodoro", JSON.stringify(activePomodoro()));
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
          <div style={{ height: "3rem", width: "100%", padding: "1rem" }}>
            {backlogs.loading && "loading..."}
          </div>
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
          selected={activePomodoro}
          pomodoro={pomodoro}
          changePomodoroState={async (value: PomodoroFocusType) => {
            if (value === "Focus") {
              setPomodoro(value);
              return;
            }
            console.log("correct", activePomodoro());
            setPomodoro(value);
            if (activePomodoro()) {
              setActivePomodoro((prev) => {
                if (prev) {
                  return { ...prev, current: prev.current + 1 };
                }
                return prev;
              });
              localStorage.setItem(
                "activePomodoro",
                JSON.stringify(activePomodoro())
              );
              const res = await fetch(`${API_ROOT}/pomodoros/edit`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: activePomodoro()?._id,
                  est: activePomodoro()?.end,
                  // FIXME : fix the type (it should not be (as ...))
                  // should infer the type
                  act: (activePomodoro() as PomodoroType).current + 1,
                }),
              });
              if (res.status != 200) {
                /// FIXME : set error///
                throw Error("Error in creating a backlog task");
              }
              refetchPomodoros();
            }
          }}
        >
          <div style={{ height: "3rem", width: "100%", padding: "1rem" }}>
            {pomodoros.loading && "loading..."}
          </div>
          <For each={pomodoros()}>
            {(item) => (
              <>
                <PomodoroItem
                  activePomodoro={activePomodoro}
                  handleActive={() => handleActive(item._id)}
                  {...item}
                >
                  <button
                    disabled={activePomodoro()?._id == item._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveToBacklogs(item._id);
                    }}
                  >
                    {"⬅ "}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      item._id === showDetail()
                        ? setShowDetail("")
                        : setShowDetail(item._id);
                    }}
                  >
                    {item._id !== showDetail() ? "⬇" : "⬆"}
                  </button>
                  <button onClick={() => console.log("make task done")}>
                    {"✔"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePomodoro(item._id);
                    }}
                  >
                    {"X"}
                  </button>
                </PomodoroItem>
                <SlideIn showDetail={showDetail} id={item._id}>
                  <Show when={showDetail() === item._id}>
                    <PomodoroItemConfigForm
                      current={item.current}
                      end={item.end}
                      id={item._id}
                      revalidate={() => {
                        // FIXME: add mutate instead of refetch again
                        refetchPomodoros();
                      }}
                    >
                      <div>
                        <button onClick={() => setShowDetail("")}>
                          cancel
                        </button>
                        <button form="pomodoro-config" type="submit">
                          save
                        </button>
                      </div>
                    </PomodoroItemConfigForm>
                  </Show>
                </SlideIn>
              </>
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

type PomodoroItemConfigFormProps = ParentProps<{
  current: number;
  end: number;
  id: string;
  revalidate: () => void;
}>;

const PomodoroItemConfigForm: Component<PomodoroItemConfigFormProps> = ({
  current,
  end,
  children,
  id,
  revalidate,
}) => {
  const [state, setState] = createStore<{
    act: number;
    est: number;
    active: "act" | "est";
  }>({ active: "est", act: current, est: end });

  return (
    <>
      <form
        id="pomodoro-config"
        style={{
          display: "flex",
          "justify-content": "space-between",
          width: "100%",
        }}
        onSubmit={async (e) => {
          // TODO : add optimistic ui
          e.preventDefault();
          const res = await fetch(`${API_ROOT}/pomodoros/edit`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, act: state.act, est: state.est }),
          });

          if (res.status != 200) {
            /// FIXME : set error///
            throw Error("Error in creating a backlog task");
          }
          revalidate();
        }}
      >
        <div>
          <span
            style={{
              padding: ".5rem 1rem",
              "font-size": "2rem",
              "border-radius": "50%",
              border: state.active === "act" ? "1px solid green" : "unset",
              cursor: "pointer",
            }}
            onClick={() =>
              setState({
                active: "act",
              })
            }
          >
            {state.act}
          </span>
          <span style={{ "font-size": "2rem", margin: "0 .5rem" }}>/</span>
          <span
            onClick={() =>
              setState({
                active: "est",
              })
            }
            style={{
              padding: ".5rem 1rem",
              "font-size": "2rem",
              "border-radius": "50%",
              border: state.active === "est" ? "1px solid green" : "unset",
              cursor: "pointer",
            }}
          >
            {state.est}
          </span>
        </div>
        <div style={{ display: "flex" }}>
          <button
            type="button"
            onClick={() =>
              setState({
                [state.active]: state[state.active] + 1,
              })
            }
          >
            {"⬆"}
          </button>
          <button
            type="button"
            onClick={() =>
              setState({
                [state.active]:
                  state[state.active] > 0 ? state[state.active] - 1 : 0,
              })
            }
          >
            {"⬇"}
          </button>
        </div>
      </form>
      {children}
    </>
  );
};

type SlideInProps = ParentProps<{ showDetail: Accessor<string>; id: string }>;

const SlideIn: Component<SlideInProps> = ({ children, showDetail, id }) => {
  return (
    <div
      style={{
        display: "flex",
        "justify-content": "space-between",
        "flex-direction": "column",
        height: showDetail() !== id ? 0 : "10rem",
        width: showDetail() !== id ? 0 : "100%",
        transition: "all  40ms ease-out",
      }}
    >
      {children}
    </div>
  );
};
