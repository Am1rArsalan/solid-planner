import { Component } from "solid-js";
import { createStore } from "solid-js/store";
import styles from "./Backlog.module.css";

export const BackLog: Component<{
  handleAdd: (value: string) => void;
  handleRemove: (value: string) => void;
}> = ({ children, handleAdd }) => {
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

  return (
    <div class={styles.Backlog}>
      <h2> Backlog </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd(state.value);
          setState({
            value: "",
            isSubmitting: false,
          });
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

export const BacklogItem: Component<{ title: string }> = ({
  title,
  children,
}) => {
  return (
    <div class={styles.Task}>
      <div class={styles.TaskTitle}>{title}</div>
      <div class={styles.TaskActions}>{children}</div>
    </div>
  );
};
