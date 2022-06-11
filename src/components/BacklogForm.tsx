import { Component } from "solid-js";
import { createStore } from "solid-js/store";
import { useStore } from "../store";
import styles from "./styles/BacklogForm.module.css";
import { Button, IconButton } from "./UI/button";
import { ArrowDown } from "./UI/icons/ArrowDown";
import { ArrowUp } from "./UI/icons/ArrowUp";

const AddBacklogForm: Component<{ handleClose: () => void }> = ({
  handleClose,
}) => {
  const [
    { backlogs },
    { addBacklog, addPendingItem, revalidateAddedItem, removePendingItem },
  ] = useStore();
  const [state, setState] = createStore<{
    est: number;
    value: string;
  }>({
    est: 0,
    value: "",
  });

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
      const addedBacklog = await addBacklog({
        title: state.value,
        order: backlogs().length,
        end: state.est,
      });
      revalidateAddedItem(addedBacklog, creationTime);
    } catch (error) {
      removePendingItem(creationTime);
    }

    setState({
      est: 0,
      value: "",
    });
  };

  const handleChangeValue = (
    ev: Event & { currentTarget: HTMLInputElement; target: Element }
  ) => {
    setState({
      value: ev.currentTarget.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} class={styles.AddForm}>
      <div class={styles.FormBody}>
        <div class={styles.FormController}>
          <input
            value={state.value}
            onChange={handleChangeValue}
            class={styles.BacklogInput}
            placeholder="What's the task title?"
          />
        </div>
        <div class={styles.FormController}>
          <div class={styles.ShowEst}>
            <span>{state.est}</span>
          </div>
          <div style={{ display: "flex" }}>
            <IconButton
              type="button"
              class={styles.ConfigButton}
              onClick={() =>
                setState({
                  est: state.est + 1,
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
                  est: state.est > 0 ? state.est - 1 : 0,
                })
              }
            >
              <ArrowDown width={16} height={16} fill="#555555d9" />
            </IconButton>
          </div>
        </div>
      </div>
      <div class={styles.FormFooter}>
        <Button onClick={handleClose} class={styles.FooterCancelButton}>
          cancel
        </Button>
        <Button
          disabled={state.value.length === 0}
          class={styles.FooterSaveButton}
          type="submit"
        >
          save
        </Button>
      </div>
    </form>
  );
};

export default AddBacklogForm;
