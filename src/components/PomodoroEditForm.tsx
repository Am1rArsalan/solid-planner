import { Component } from "solid-js";
import { createStore } from "solid-js/store";
import { useStore } from "../store";
import styles from "./TaskForm.module.css";
import { Button, IconButton } from "./UI/button";
import { ArrowDown } from "./UI/icons/ArrowDown";
import { ArrowUp } from "./UI/icons/ArrowUp";

type Props = {
  title: string;
  current: number;
  end: number;
  id: string;
  handleClose: () => void;
};

const PomodoroEditForm: Component<Props> = ({
  current,
  end,
  id,
  handleClose,
  title,
}) => {
  const [_, { loadPomodoros, editPomodoro }] = useStore();
  const [state, setState] = createStore<{
    act: number;
    est: number;
    title: string;
    active: "act" | "est";
  }>({ active: "est", act: current, est: end, title });

  const handleSubmit = async (
    e: Event & { submitter: HTMLElement } & {
      currentTarget: HTMLFormElement;
      target: Element;
    }
  ) => {
    e.preventDefault();
    try {
      await editPomodoro(id, state.est, state.act, state.title);
      loadPomodoros();
    } catch (error) {
      // TODO : handle error
    }
  };

  const handleChangeValue = (
    ev: Event & { currentTarget: HTMLInputElement; target: Element }
  ) => {
    setState({
      title: ev.currentTarget.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} class={styles.AddForm}>
      <div class={styles.FormBody}>
        <div class={styles.FormController}>
          <input
            value={state.title}
            onChange={handleChangeValue}
            class={styles.TaskInput}
            placeholder="What's the task title?"
          />
        </div>
        <div class={styles.FormController}>
          <div class={styles.ShowEst}>
            <span>{state.act} </span>
            <span> / </span>
            <span>{state.est}</span>
          </div>
          <IconButton
            type="button"
            class={styles.ConfigButton}
            onClick={() =>
              setState({
                [state.active]: state[state.active] + 1,
              })
            }
          >
            <ArrowUp width={16} height={16} fill="#555555d9" />
          </IconButton>
          <IconButton
            type="button"
            class={styles.ConfigButton}
            onClick={() =>
              setState({
                [state.active]:
                  state[state.active] > 0 ? state[state.active] - 1 : 0,
              })
            }
          >
            <ArrowDown width={16} height={16} fill="#555555d9" />
          </IconButton>
        </div>
      </div>
      <div class={styles.FormFooter}>
        <Button onClick={handleClose} class={styles.FooterCancelButton}>
          cancel
        </Button>
        <Button class={styles.FooterSaveButton} type="submit">
          save
        </Button>
      </div>
    </form>
  );
};

export default PomodoroEditForm;
