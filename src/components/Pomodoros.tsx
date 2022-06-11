import {
  Accessor,
  Component,
  createSignal,
  For,
  ParentProps,
  Show,
} from "solid-js";
import { PomodoroItem, SortablePomodoroItem } from "./PomodoroItem";
import PomodoroTimer from "./PomodoroTimer";
import PomodoroEditForm from "./PomodoroEditForm";
import { PomodoroType } from "../types/pomodoro";
import {
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  SortableProvider,
  closestCenter,
} from "@thisbeyond/solid-dnd";
import { useStore } from "../store";
import { IconButton } from "./UI/button";
import { Close } from "./UI/icons/Close";
import { ArrowDown } from "./UI/icons/ArrowDown";
import { ArrowLeft } from "./UI/icons/ArrowLeft";
import { ArrowUp } from "./UI/icons/ArrowUp";
import { Check } from "./UI/icons/Check";

type Props = {
  move: (id: string, currentStatus: "Backlog" | "Pomodoro") => void;
};

const Pomodoros: Component<Props> = ({ move }) => {
  const [showEdit, setShowForm] = createSignal("");
  const [activeDrag, setActiveDrag] = createSignal(null);
  const [
    { pomodoros, activePomodoro },
    {
      remove,
      clientRemoveRevalidate,
      clientRemove,
      mutatePomodoros,
      changePomodorosOrder,
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

  // FIX : ts error ( dnd )
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
          await changePomodorosOrder({
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
    const activeItem = pomodoros().find((item) => item._id == id);
    changeActivePomodoro(activeItem ? activeItem : null);
  };

  const makeTaskDone = async (id: string) => {
    clientFilterDoneTask(id);
    try {
      await makeTaskDone(id);
    } catch (error) {
      clientFilterDoneTaskRevalidate(id);
    }
  };

  // FIXME : resolve solid dnd TS errors
  return (
    <PomodoroTimer>
      <div style={{ height: "3rem", width: "100%", padding: "1rem" }}>
        {pomodoros.loading && "loading..."}
      </div>
      <DragDropProvider
        onDragStart={({ draggable }) => {
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
                <Show
                  when={showEdit() !== item._id}
                  fallback={
                    <SlideIn showEdit={showEdit} id={item._id}>
                      <PomodoroEditForm
                        current={item.current}
                        end={item.end}
                        id={item._id}
                        handleClose={() => setShowForm("")}
                        title={item.title}
                      />
                    </SlideIn>
                  }
                >
                  <SortablePomodoroItem
                    activePomodoro={activePomodoro}
                    handleActive={() => handleActive(item._id)}
                    {...item}
                  >
                    <IconButton
                      disabled={activePomodoro()?._id == item._id}
                      onClick={(e) => {
                        e.stopPropagation();
                        move(item._id, "Pomodoro");
                      }}
                    >
                      <ArrowLeft width={16} height={16} fill="#000" />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        item._id === showEdit()
                          ? setShowForm("")
                          : setShowForm(item._id);
                      }}
                    >
                      {item._id !== showEdit() ? (
                        <ArrowDown width={16} height={16} fill="#000" />
                      ) : (
                        <ArrowUp width={16} height={16} fill="#000" />
                      )}
                    </IconButton>
                    <IconButton
                      onClick={(ev) => {
                        makeTaskDone(item._id);
                        ev.stopPropagation();
                      }}
                    >
                      <Check width={16} height={16} fill="#000" />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePomodoro(item._id);
                      }}
                    >
                      <Close width={18} height={18} fill="#000" />
                    </IconButton>
                  </SortablePomodoroItem>
                </Show>
              </>
            )}
          </For>
        </SortableProvider>
        <DragOverlay>
          <PomodoroItem
            activePomodoro={activeDrag}
            draggableId={"pomodoros-dnd"}
          >
            heyyyy
          </PomodoroItem>
        </DragOverlay>
      </DragDropProvider>
    </PomodoroTimer>
  );
};

type SlideInProps = ParentProps<{ showEdit: Accessor<string>; id: string }>;

const SlideIn: Component<SlideInProps> = ({ children, showEdit, id }) => {
  return (
    <div
      style={{
        width: showEdit() !== id ? 0 : "100%",
        height: showEdit() !== id ? 0 : "10rem",
        display: "flex",
        "justify-content": "space-between",
        "flex-direction": "column",
        transition: "all  40ms ease-out",
      }}
    >
      {children}
    </div>
  );
};

export default Pomodoros;
