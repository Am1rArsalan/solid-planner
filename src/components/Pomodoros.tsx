import {
  Accessor,
  Component,
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
import { PomodoroType } from "../types/pomodoro";
import {
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  SortableProvider,
  closestCenter,
} from "@thisbeyond/solid-dnd";
import { useStore } from "../store";

const Pomodoros: Component<{
  move: (id: string, currentStatus: "Backlog" | "Pomodoro") => void;
}> = ({ move }) => {
  const [showDetail, setShowDetail] = createSignal("");
  const [activeDrag, setActiveDrag] = createSignal(null);

  const [
    { pomodoros, activePomodoro },
    {
      remove,
      clientRemoveRevalidate,
      clientRemove,
      mutatePomodoros,
      changeOrder,
      clientFilterDoneTask,
      clientFilterDoneTaskRevalidate,
      changeActivePomodoro,
    },
  ] = useStore();

  const pomodoroIds = () => pomodoros().map((item) => item._id);

  const handleRemovePomodoro = async (id: string) => {
    if (id.length === 0) return;
    let removedItemIndex = pomodoros().findIndex(
      (item) => item._id == id
    ) as number;
    let removedItem = pomodoros()[removedItemIndex] as PomodoroType;

    clientRemove(id);

    try {
      await remove(id);
    } catch (error) {
      clientRemoveRevalidate(removedItem);
    }

    if (activePomodoro()?._id == id) {
      changeActivePomodoro(null);
    }
  };

  const onDragEnd = async ({ draggable, droppable }) => {
    if (draggable && droppable) {
      const currentItems = pomodoros();
      const fromIndex = currentItems.findIndex(
        (item) => `${item._id}-${item.order}` === draggable.id
      );
      const toIndex = currentItems.findIndex(
        (item) => `${item._id}-${item.order}` === droppable?.id
      );

      if (
        currentItems[fromIndex]._id.includes("Pending") ||
        currentItems[toIndex]._id.includes("Pending")
      ) {
        return;
      }

      if (fromIndex !== toIndex) {
        let updatedItems = currentItems.slice();
        updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));

        mutatePomodoros(updatedItems);

        try {
          await changeOrder({
            orders: updatedItems.map((item, order) => ({
              ...item,
              order: order + 1,
            })),
            status: "Pomodoro",
          });
        } catch {
          // handle error
        }
      }
    }
    setActiveDrag(null);
  };

  const handleActive = async (id: string) => {
    if (id === activePomodoro()?._id) return;
    changeActivePomodoro(pomodoros()?.find((item) => item._id == id));
  };

  const makeTaskDone = async (id: string) => {
    clientFilterDoneTask(id);
    try {
      await makeTaskDone(id);
    } catch (error) {
      clientFilterDoneTaskRevalidate(id);
    }
  };

  return (
    <PomodoroContainer>
      <div style={{ height: "3rem", width: "100%", padding: "1rem" }}>
        {pomodoros.loading && "loading..."}
      </div>
      <DragDropProvider
        onDragStart={({ draggable }) => {
          console.log("drag start");
          setActiveDrag(draggable);
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
                      move(item._id, "Pomodoro");
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
            {...activeDrag()}
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
