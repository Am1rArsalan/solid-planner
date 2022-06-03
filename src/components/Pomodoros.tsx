import {
  Accessor,
  Component,
  createResource,
  createSignal,
  For,
  ParentProps,
  Show,
} from "solid-js";
import {
  PomodoroContainer,
  PomodoroItemContainer,
  SortablePomodoroItem,
} from "./Pomodoro";
import PomodoroItemConfigForm from "./PomodoroItemConfigForm";
import { PomodoroFocusType, PomodoroType } from "../types/pomodoro";
import {
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  SortableProvider,
  closestCenter,
} from "@thisbeyond/solid-dnd";
import { API_ROOT } from "../constants/api";

type Props = {
  moveBacklog: (id: string, currentStatus: "Backlog" | "Pomodoro") => void;
};

const Pomodoros: Component<Props> = () => {
  const [pomodoro, setPomodoro] = createSignal<PomodoroFocusType>("Focus");
  const [showDetail, setShowDetail] = createSignal("");
  const [activePomodoroDragItem, setActivePomodoroDragItem] =
    createSignal(null);

  const selectedPomodoro = localStorage.getItem("activePomodoro");
  const [activePomodoro, setActivePomodoro] = createSignal<PomodoroType | null>(
    selectedPomodoro !== null ? JSON.parse(selectedPomodoro) : null
  );

  // pomodoros resource
  // TODO : make own resource
  const [pomodoros, { mutate, refetch }] = createResource<PomodoroType[]>(
    async () => {
      const res = await (
        await fetch(`${API_ROOT}/pomodoros`, { method: "GET" })
      ).json();
      return res.data;
    },
    {
      initialValue: [],
    }
  );

  const pomodoroIds = () => pomodoros().map((item) => item._id);

  // TODO : make own resource
  // remove backlog task ( pomodoros resource)
  const handleRemovePomodoro = async (id: string) => {
    if (id.length === 0) return;
    // FIXME: redo this types

    let removedItemIndex = pomodoros().findIndex(
      (item) => item._id == id
    ) as number;
    let removedItem = pomodoros()[removedItemIndex] as PomodoroType;

    mutate((prev) => {
      return prev?.filter((item) => item._id !== id);
    });
    const res = await fetch(`${API_ROOT}/pomodoros/${id}`, {
      method: "DELETE",
    });
    // TODO : if there was an error add the item in removedItemIndex
    if (res.status != 200) {
      mutate((prev) => {
        return [...prev, removedItem];
      });
      throw Error("Error in removing a backlog task");
    }

    if (activePomodoro()?._id == id) {
      localStorage.setItem("activePomodoro", JSON.stringify(null));
      setActivePomodoro(null);
    }
  };

  const onDragEnd = async ({ draggable, droppable }) => {
    console.log("drag end");
    if (draggable && droppable) {
      const currentItems = pomodoros();
      const fromIndex = currentItems.findIndex(
        (item) => item._id === draggable.id
      );
      const toIndex = currentItems.findIndex(
        (item) => item._id === droppable.id
      );

      if (fromIndex !== toIndex) {
        let updatedItems = currentItems.slice();
        updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));

        mutate(updatedItems);

        const res = await fetch(`${API_ROOT}/pomodoros/order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orders: updatedItems.map((item, order) => ({
              ...item,
              order: order + 1,
            })),
            status: "Pomodoro",
          }),
        });

        if (res.status !== 200) {
          // </div> </div>
        }
      }
    }
    setActivePomodoroDragItem(null);
  };

  const handleChangePomodoroState = async (value: PomodoroFocusType) => {
    // BUG : on first pomodoro focus pomodoro
    // it will increase the current counter 2 time
    if (value === "Focus") {
      setPomodoro(value);
      return;
    }
    setPomodoro(value);
    if (activePomodoro()) {
      setActivePomodoro((prev) => {
        if (prev) {
          return { ...prev, current: prev.current + 1 };
        }
        return prev;
      });
      localStorage.setItem("activePomodoro", JSON.stringify(activePomodoro()));
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
      refetch();
    }
  };

  const handleActive = async (id: string) => {
    if (id === activePomodoro()?._id) return;
    setActivePomodoro(pomodoros()?.find((item) => item._id == id));
    activePomodoro() &&
      localStorage.setItem("activePomodoro", JSON.stringify(activePomodoro()));
  };

  const makeTaskDone = async (id: string) => {
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

    const res = await fetch(`${API_ROOT}/pomodoros/done/${id}`, {
      method: "PUT",
    });

    if (res.status != 200) {
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
    }
  };

  return (
    <PomodoroContainer
      selected={activePomodoro}
      pomodoro={pomodoro}
      changePomodoroState={handleChangePomodoroState}
    >
      <div style={{ height: "3rem", width: "100%", padding: "1rem" }}>
        {pomodoros.loading && "loading..."}
      </div>

      <DragDropProvider
        onDragStart={({ draggable }) => {
          console.log("drag start");
          setActivePomodoroDragItem(draggable);
        }}
        onDragEnd={onDragEnd}
        collisionDetector={closestCenter}
      >
        <DragDropSensors />
        <SortableProvider ids={pomodoroIds() || []}>
          <For each={pomodoros()}>
            {(item) => (
              <>
                <SortablePomodoroItem
                  activePomodoro={activePomodoro}
                  handleActive={() => handleActive(item._id)}
                  {...item}
                >
                  <button
                    disabled={activePomodoro()?._id == item._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMove(item._id, "Pomodoro");
                    }}
                  >
                    {"⬅"}
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
                  <button
                    onClick={(ev) => {
                      makeTaskDone(item._id);
                      ev.stopPropagation();
                    }}
                  >
                    {"✔"}
                  </button>
                  <button
                    disabled={activePomodoro()?._id == item._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePomodoro(item._id);
                    }}
                  >
                    {"X"}
                  </button>
                </SortablePomodoroItem>
                <SlideIn showDetail={showDetail} id={item._id}>
                  <Show when={showDetail() === item._id}>
                    <PomodoroItemConfigForm
                      current={item.current}
                      end={item.end}
                      id={item._id}
                      revalidate={() => {
                        // FIXME: add mutate instead of refetch again
                        refetch();
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
        </SortableProvider>
        <DragOverlay>
          <PomodoroItemContainer
            {...activePomodoroDragItem()}
            draggableId={"pomodoros-dnd"}
          >
            heyyyy
          </PomodoroItemContainer>
        </DragOverlay>
      </DragDropProvider>
    </PomodoroContainer>
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

export default Pomodoros;
