import { createSortable } from "@thisbeyond/solid-dnd";
import { Component, ParentProps } from "solid-js";
import { createStore } from "solid-js/store";
import { PomodoroType } from "../types/pomodoro";
import styles from "./Backlog.module.css";

type Props = ParentProps<{
  handleAdd: (value: string) => void;
}>;

export const BacklogsContainer: Component<Props> = ({
  children,
  handleAdd,
}) => {
  const [state, setState] = createStore<{
    value: string;
    isSubmitting: boolean;
  }>({
    value: "",
    isSubmitting: false,
  });

  const handleChangeValue = (
    ev: Event & { currentTarget: HTMLInputElement; target: Element }
  ) => {
    setState({
      value: ev.currentTarget.value,
    });
  };

  const handleSubmit = () => {
    handleAdd(state.value);
    setState({
      value: "",
      isSubmitting: false,
    });
  };

  return (
    <div class={styles.Backlog}>
      <h2> Backlogs</h2>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          handleSubmit();
        }}
      >
        <input
          value={state.value}
          onChange={handleChangeValue}
          class={styles.TaskInput}
        />
      </form>
      {children}
    </div>
  );
};

export const SortableBacklogItem: Component<
  ParentProps<{ backlog: PomodoroType; draggableId: string }>
> = (props) => {
  const { children, backlog } = props;
  const sortable = createSortable(`${backlog._id}-${backlog.order}`);

  return (
    <div
      use:sortable
      class={["sortable", styles.Task].join(" ")}
      classList={{ "opacity-25": sortable.isActiveDraggable }}
    >
      <div class={styles.TaskTitle}>{backlog?.title}</div>
      <div class={styles.TaskActions}>{children}</div>
    </div>
  );
};

export const BacklogItem: Component<
  ParentProps<{ backlog: PomodoroType | null; draggableId: string }>
> = (props) => {
  const { children, backlog } = props;

  return (
    <div class={["sortable", styles.Task].join(" ")}>
      <div class={styles.TaskTitle}>{backlog?.title}</div>
      <div class={styles.TaskActions}>{children}</div>
    </div>
  );
};
