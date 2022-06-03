import { Component, createResource, createSignal, For } from "solid-js";
import { BacklogsContainer, BacklogItem, SortableBacklogItem } from "./Backlog";
import { PomodoroType } from "../types/pomodoro";
import {
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  SortableProvider,
  closestCenter,
} from "@thisbeyond/solid-dnd";
import { API_ROOT } from "../constants/api";
import { useStore } from "../store";

type Props = {
  moveBacklog: (id: string, currentStatus: "Backlog" | "Pomodoro") => void;
};

const Backlogs: Component<Props> = ({ moveBacklog }) => {
  // backlogs
  const [activeItem, setActiveItem] = createSignal(null);
  const [store, actions] = useStore();
  const backlogIds = () => store.backlogs().map((item) => item._id);

  console.log(store, actions);
  console.log(store.backlogs.loading);
  console.log(store.backlogs());

  // add task to backlogs
  // TODO : make own resource
  const handleAdd = async (task: string) => {
    if (!task.length) return;
    const creationTime = new Date().toISOString();
    const prev = store.backlogs();

    actions.mutateBacklogs([
      ...prev,
      {
        current: 0,
        done: false,
        end: 0,
        isRemoved: false,
        status: "Backlog",
        title: task,
        updated_at: creationTime,
        created_at: creationTime,
        order: prev.length + 1,
        _id: "Pending",
      },
    ]);

    const res = actions.addBacklog(
      {
        title: task,
        order: store.backlogs().length,
      },
      store.token
    );
    //const res = await fetch(`${API_ROOT}/pomodoros`, {
    //method: "POST",
    //headers: {
    //"Content-Type": "application/json",
    //},
    //body: JSON.stringify({}),
    //});

    if (res.status != 201) {
      actions.mutateBacklogs(
        store.backlogs().filter((item) => item.created_at !== creationTime)
      );
    }
    const addedTask = (await res.json()).data;

    actions.mutateBacklogs(
      store.backlogs().map((item) => {
        if (item.created_at === creationTime) {
          return addedTask;
        }
        return item;
      })
    );
  };

  const handleRemoveBacklog = async (id: string) => {
    if (id.length === 0) return;
    // FIXME: redo this types

    let removedItemIndex = store
      .backlogs()
      .findIndex((item) => item._id == id) as number;
    let removedItem = store.backlogs()[removedItemIndex] as PomodoroType;

    actions.mutateBacklogs(store.backlogs()?.filter((item) => item._id !== id));
    const res = await fetch(`${API_ROOT}/pomodoros/${id}`, {
      method: "DELETE",
    });

    // TODO : correct the recovery index
    // TODO : if there was an error add the item in removedItemIndex
    if (res.status != 200) {
      actions.mutateBacklogs([...store.backlogs(), removedItem]);
      throw Error("Error in removing a backlog task");
    }
  };

  const onDragEnd = async ({ draggable, droppable }) => {
    if (draggable && droppable) {
      const currentItems = store.backlogs();
      const fromIndex = currentItems.findIndex(
        (item) => item._id === draggable.id
      );
      const toIndex = currentItems.findIndex(
        (item) => item._id === droppable.id
      );

      if (fromIndex !== toIndex) {
        let updatedItems = currentItems.slice();
        console.log(updatedItems);
        updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));

        actions.mutateBacklogs(updatedItems);
        console.log(updatedItems);

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
            status: "Backlog",
          }),
        });

        if (res.status !== 200) {
          // </div> </div>
        }
      }
    }
    setActiveItem(null);
  };

  return (
    <DragDropProvider
      onDragStart={({ draggable }) => {
        setActiveItem(draggable);
      }}
      onDragEnd={onDragEnd}
      collisionDetector={closestCenter}
    >
      <BacklogsContainer handleAdd={handleAdd}>
        <div style={{ height: "3rem", width: "100%", padding: "1rem" }}>
          {store.backlogs.loading && "loading..."}
        </div>
        <DragDropSensors />
        <SortableProvider ids={backlogIds() || []}>
          <For each={store.backlogs()}>
            {(task) => (
              <SortableBacklogItem
                backlog={task}
                draggableId={`backlogs-dnd-${task._id}`}
              >
                <button
                  disabled={task._id === "Pending"}
                  onClick={() => moveBacklog(task._id, "Backlog")}
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
