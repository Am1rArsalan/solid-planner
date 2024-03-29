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
import SlideIn from "./UI/slide-in/SlideIn";

type Props = {
  move: (id: string, currentStatus: "Backlog" | "Pomodoro") => void;
};

function Pomodoros({ move }: Props) {
  const [showEdit, setShowForm] = createSignal("");
  const [activeDrag, setActiveDrag] = createSignal(null);
  const [
    store,
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

  const pomodoroIds = () => store.pomodoros.map((item) => item._id);

  const handleRemovePomodoro = async (id: string) => {
    if (id.length === 0) return;
    const removedItemIndex = store.pomodoros.findIndex(
      (item) => item._id == id
    ) as number;
    const removedItem = store.pomodoros[removedItemIndex] as PomodoroType;

    clientRemove(id);

    try {
      await remove(id);
    } catch (error) {
      clientRemoveRevalidate(removedItem);
    }

    if (store.activePomodoro?._id == id) {
      changeActivePomodoro(null);
    }
  };

  // FIX : ts error ( dnd )
  const onDragEnd = async ({ draggable, droppable }) => {
    if (draggable && droppable) {
      const currentItems = store.pomodoros;
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
        const updatedItems = currentItems.slice();
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
    if (id === store.activePomodoro?._id) return;
    const activeItem = store.pomodoros.find((item) => item._id == id);
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
        {!store.pomodoros && "loading..."}
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
          <For each={store.pomodoros}>
            {(item) => (
              <>
                <Show
                  when={showEdit() !== item._id}
                  fallback={
                    <SlideIn showEdit={showEdit() !== item._id}>
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
                    activePomodoro={store.activePomodoro}
                    handleActive={() => handleActive(item._id)}
                    {...item}
                  >
                    <IconButton
                      disabled={store.activePomodoro?._id == item._id}
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
            hey
          </PomodoroItem>
        </DragOverlay>
      </DragDropProvider>
    </PomodoroTimer>
  );
}

export default Pomodoros;
