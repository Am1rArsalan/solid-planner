import { createSortable } from "@thisbeyond/solid-dnd";
import { Component, ParentProps } from "solid-js";
import { BacklogType } from "../types/pomodoro";
import styles from "./styles/BacklogItem.module.css";
import { classNames } from "./UI/utils/classNames";

export const SortableBacklogItem: Component<
  ParentProps<{ backlog: BacklogType; draggableId: string }>
> = (props) => {
  const { children, backlog } = props;
  const sortable = createSortable(`${backlog._id}-${backlog.order}`);

  // FIXME: TS error (solid-dnd)
  return (
    <div
      use:sortable
      class={classNames("sortable", styles.Backlog)}
      classList={{ "opacity-25": sortable.isActiveDraggable }}
    >
      <div class={styles.BacklogTitle}>{backlog.title}</div>
      <div class={styles.BacklogActions}>{children}</div>
    </div>
  );
};

export const BacklogItem: Component<
  ParentProps<{ backlog: BacklogType | null; draggableId: string }>
> = (props) => {
  const { children, backlog } = props;

  return (
    <div class={classNames("sortable", styles.Backlog)}>
      <div class={styles.BacklogTitle}>{backlog?.title}</div>
      <div class={styles.BacklogActions}>{children}</div>
    </div>
  );
};
