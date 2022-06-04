import { Component, createSignal, For } from "solid-js";
import { BacklogsContainer, BacklogItem, SortableBacklogItem } from "./Backlog";
import { PomodoroType } from "../types/pomodoro";
import {
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  SortableProvider,
  closestCenter,
} from "@thisbeyond/solid-dnd";
import { useStore } from "../store";

const Backlogs: Component<{
  move: (id: string, currentStatus: "Backlog" | "Pomodoro") => void;
}> = ({ move }) => {
  const [{ backlogs }, actions] = useStore();
  const [activeItem, setActiveItem] = createSignal(null);
  const backlogIds = () => backlogs().map((item) => item._id);

  const handleAdd = async (task: string) => {
    if (!task.length) return;
    const creationTime = new Date().toISOString();

    actions.addPendingItem({
      creationTime,
      title: task,
    });

    try {
      const addedTask = await actions.addBacklog({
        title: task,
        order: backlogs().length,
      });
      actions.revalidateAddedItem(addedTask, creationTime);
    } catch (error) {
      actions.removePendingItem(creationTime);
    }
  };

  const handleRemoveBacklog = async (id: string) => {
    if (id.length === 0) return;
    // FIXME: redo this types

    let removedItemIndex = backlogs().findIndex(
      (item) => item._id == id
    ) as number;
    let removedItem = backlogs()[removedItemIndex] as PomodoroType;

    actions.mutateBacklogs(backlogs()?.filter((item) => item._id !== id));
    try {
      await actions.remove(id);
    } catch (error) {
      actions.mutateBacklogs([...backlogs(), removedItem]);
    }
  };

  return (
    <DragDropProvider
      onDragStart={({ draggable }) => {
        setActiveItem(draggable.id);
      }}
      onDragEnd={async ({ draggable, droppable }) => {
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
            updatedItems.splice(
              toIndex,
              0,
              ...updatedItems.splice(fromIndex, 1)
            );

            actions.mutateBacklogs(updatedItems);

            try {
              await actions.changeOrder({
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
      }}
      collisionDetector={closestCenter}
    >
      <BacklogsContainer handleAdd={handleAdd}>
        <div style={{ height: "3rem", width: "100%", padding: "1rem" }}>
          {backlogs.loading && "loading..."}
        </div>
        <DragDropSensors />
        <SortableProvider ids={backlogIds()}>
          <For each={backlogs()}>
            {(task) => (
              <SortableBacklogItem
                backlog={task}
                draggableId={`backlogs-dnd-${task._id}`}
              >
                <button
                  disabled={task._id === "Pending"}
                  onClick={() => move(task._id, "Backlog")}
                >
                  {"➡"}
                </button>
                <button
                  disabled={task._id === "Pending"}
                  onClick={() => handleRemoveBacklog(task._id)}
                >
                  {"X"}
                </button>
              </SortableBacklogItem>
            )}
          </For>
        </SortableProvider>
        <DragOverlay>
          <BacklogItem backlog={activeItem()} draggableId={"backlogs-dnd"}>
            <button>{"➡"}</button>
            <button>{"X"}</button>
          </BacklogItem>
        </DragOverlay>
      </BacklogsContainer>
    </DragDropProvider>
  );
};

export default Backlogs;
