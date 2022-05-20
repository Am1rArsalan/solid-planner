import { Component } from "solid-js";
import { createStore } from "solid-js/store";
import { TaskType } from "../types/backlog";
import styles from "./Backlog.module.css";

type Props = {
  handleAdd: (value: string) => void;
  handleRemove: (value: string) => void;
};

export const BackLog: Component<Props> = ({ children, handleAdd }) => {
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
      <h2> Backlog </h2>
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

export const BacklogItem: Component<TaskType> = ({ title, children }) => {
  return (
    <div class={styles.Task}>
      <div class={styles.TaskTitle}>{title}</div>
      <div class={styles.TaskActions}>{children}</div>
    </div>
  );
};
