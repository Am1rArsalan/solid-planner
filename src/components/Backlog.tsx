import { createSortable } from "@thisbeyond/solid-dnd";
import { Component, createSignal, ParentProps, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { BacklogType, PomodoroType } from "../types/pomodoro";
import styles from "./Backlog.module.css";
import Add from "./UI/icons/Add";

type Props = ParentProps<{
  handleAdd: (value: string) => void;
}>;

export const BacklogsContainer: Component<Props> = ({
  children,
  handleAdd,
}) => {
  const [showForm, setShowForm] = createSignal(false);
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
      <Show
        when={showForm()}
        fallback={
          <button
            class={styles.OpenFormButton}
            onClick={() => setShowForm(true)}
          >
            <Add width={20} height={20} />
            <span>Add Task</span>
          </button>
        }
      >
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            handleSubmit();
          }}
          class={styles.AddForm}
        >
          <div class={styles.FormBody}>
            <div class={styles.FormController}>
              <input
                value={state.value}
                onChange={handleChangeValue}
                class={styles.TaskInput}
                placeholder="What's the task title?"
              />
            </div>
            <div class={styles.FormController}></div>
          </div>
          <div class={styles.FormFooter}>fkdsajfjdsa</div>
        </form>
      </Show>
      {children}
    </div>
  );
};

export const SortableBacklogItem: Component<
  ParentProps<{ backlog: BacklogType; draggableId: string }>
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
  ParentProps<{ backlog: BacklogType | null; draggableId: string }>
> = (props) => {
  const { children, backlog } = props;

  return (
    <div class={["sortable", styles.Task].join(" ")}>
      <div class={styles.TaskTitle}>{backlog?.title}</div>
      <div class={styles.TaskActions}>{children}</div>
    </div>
  );
};
