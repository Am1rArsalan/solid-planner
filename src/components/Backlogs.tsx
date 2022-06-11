import { Component, createSignal, For, ParentProps, Show } from "solid-js";
import { BacklogItem, SortableBacklogItem } from "./BacklogItem";
import {
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  SortableProvider,
  closestCenter,
} from "@thisbeyond/solid-dnd";
import { useStore } from "../store";
import { Button, IconButton } from "./UI/button";
import { ArrowRight } from "./UI/icons/ArrowRight";
import { Close } from "./UI/icons/Close";
import Add from "./UI/icons/Add";
import BacklogForm from "./BacklogForm";
import styles from "./styles/Backlogs.module.css";

type Props = {
  move: (id: string, currentStatus: "Backlog" | "Pomodoro") => void;
};

const Backlogs: Component<Props> = (props) => {
  const { move } = props;
  const [{ backlogs }, { mutateBacklogs, removeBacklog, changeBacklogsOrder }] =
    useStore();
  const [activeItem, setActiveItem] = createSignal(null);
  const backlogIds = () => backlogs().map((item) => item._id);

  const handleRemoveBacklog = async (id: string) => {
    if (id.length === 0) return;
    // FIXME: redo this types
    let removedItemIndex = backlogs().findIndex(
      (item) => item._id == id
    ) as number;
    if (removedItemIndex == -1) return;

    let removedItem = backlogs()[removedItemIndex];

    mutateBacklogs(backlogs().filter((item) => item._id !== id));
    try {
      await removeBacklog(id);
    } catch (error) {
      mutateBacklogs([...backlogs(), removedItem]);
    }
  };

  const onDragEnd = async ({ draggable, droppable }) => {
    if (draggable && droppable) {
      const currentItems = backlogs();
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
        mutateBacklogs(updatedItems);
        try {
          await changeBacklogsOrder({
            orders: updatedItems.map((item, order) => ({
              ...item,
              order: order + 1,
            })),
            status: "Backlog",
          });
        } catch {
          // handle error
        }
      }
    }
    setActiveItem(null);
  };

  // FIX : ts error on DragDropProvider
  return (
    <DragDropProvider
      onDragStart={({ draggable }) => {
        setActiveItem(draggable);
      }}
      onDragEnd={onDragEnd}
      collisionDetector={closestCenter}
    >
      <BacklogsContainer>
        <div style={{ height: "3rem", width: "100%", padding: "1rem" }}>
          {backlogs.loading && "loading..."}
        </div>
        <DragDropSensors />
        <SortableProvider ids={backlogIds()}>
          <For each={backlogs()}>
            {(task) => (
              <SortableBacklogItem
                backlog={task}
                draggableId={`backlogs()-dnd-${task._id}`}
              >
                <IconButton
                  disabled={task._id === "Pending"}
                  onClick={() => move(task._id, "Backlog")}
                >
                  <ArrowRight fill="#000" width={16} height={16} />
                </IconButton>
                <IconButton
                  disabled={task._id === "Pending"}
                  onClick={() => handleRemoveBacklog(task._id)}
                >
                  <Close fill="#000" width={18} height={18} />
                </IconButton>
              </SortableBacklogItem>
            )}
          </For>
        </SortableProvider>
        <DragOverlay>
          <BacklogItem
            backlog={activeItem()}
            draggableId={`backlogs-dnd-${activeItem()?._id}`}
          >
            <Button>
              <ArrowRight fill="#000" width={16} height={16} />
            </Button>
            <Button>
              <Close fill="#000" width={18} height={18} />
            </Button>
          </BacklogItem>
        </DragOverlay>
      </BacklogsContainer>
    </DragDropProvider>
  );
};

const BacklogsContainer: Component<ParentProps> = (props) => {
  const [showForm, setShowForm] = createSignal(false);

  return (
    <div class={styles.Backlogs}>
      <h2 class={styles.BacklogsHeader}> Backlogs </h2>
      <Show
        when={showForm()}
        fallback={
          <Button
            class={styles.OpenFormButton}
            onClick={() => setShowForm(true)}
          >
            <Add fill="#fff" width={20} height={20} />
            <span>Add Backlog</span>
          </Button>
        }
      >
        <BacklogForm handleClose={() => setShowForm(false)} />
      </Show>
      {props.children}
    </div>
  );
};

export default Backlogs;
