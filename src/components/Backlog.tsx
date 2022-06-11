import { createSortable } from "@thisbeyond/solid-dnd";
import { Component, createSignal, ParentProps, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { useStore } from "../store";
import { BacklogType } from "../types/pomodoro";
import styles from "./Backlog.module.css";
import Button from "./UI/Button";
import Add from "./UI/icons/Add";
import { ArrowDownSmall } from "./UI/icons/ArrowDown";
import { ArrowUp } from "./UI/icons/ArrowUp";

export const BacklogsContainer: Component<ParentProps> = ({ children }) => {
  const [showForm, setShowForm] = createSignal(false);
  const [state, setState] = createStore<{
    est: number;
    value: string;
    isSubmitting: boolean;
  }>({
    est: 0,
    value: "",
    isSubmitting: false,
  });
  const [
    { backlogs },
    { addBacklog, addPendingItem, revalidateAddedItem, removePendingItem },
  ] = useStore();

  const handleChangeValue = (
    ev: Event & { currentTarget: HTMLInputElement; target: Element }
  ) => {
    setState({
      value: ev.currentTarget.value,
    });
  };

  const handleClose = () => {
    setShowForm(false);
  };

  const handleSubmit = async (
    ev: Event & { submitter: HTMLElement } & {
      currentTarget: HTMLFormElement;
      target: Element;
    }
  ) => {
    ev.preventDefault();
    if (!state.value.length) return;
    const creationTime = new Date().toISOString();
    addPendingItem({
      creationTime,
      title: state.value,
      est: state.est,
    });

    try {
      const addedTask = await addBacklog({
        title: state.value,
        order: backlogs().length,
        end: state.est,
      });
      revalidateAddedItem(addedTask, creationTime);
      handleClose();
    } catch (error) {
      removePendingItem(creationTime);
    }

    setState({
      est: 0,
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
            <Add fill="#fff" width={20} height={20} />
            <span>Add Task</span>
          </button>
        }
      >
        <form onSubmit={handleSubmit} class={styles.AddForm}>
          <div class={styles.FormBody}>
            <div class={styles.FormController}>
              <input
                value={state.value}
                onChange={handleChangeValue}
                class={styles.TaskInput}
                placeholder="What's the task title?"
              />
            </div>
            <div class={styles.FormController}>
              <div class={styles.ShowEst}>{state.est}</div>
              <div style={{ display: "flex" }}>
                <button
                  type="button"
                  class={styles.ConfigButton}
                  onClick={() =>
                    setState({
                      est: state.est + 1,
                    })
                  }
                >
                  <ArrowUp width={16} height={16} fill="#555555d9" />
                </button>
                <button
                  type="button"
                  class={styles.ConfigButton}
                  onClick={() =>
                    setState({
                      est: state.est > 0 ? state.est - 1 : 0,
                    })
                  }
                >
                  <ArrowDownSmall width={16} height={16} fill="#555555d9" />
                </button>
              </div>
            </div>
          </div>
          <div class={styles.FormFooter}>
            <button
              class={[styles.FooterBaseButton, styles.FooterCancelButton].join(
                " "
              )}
              onClick={handleClose}
            >
              cancel 1
            </button>
            <Button onClick={handleClose} class={styles.FooterCancelButton}>
              cancel
            </Button>
            <button
              class={[styles.FooterBaseButton, styles.FooterSaveButton].join(
                " "
              )}
              type="submit"
            >
              save
            </button>
          </div>
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
