import { createSortable } from "@thisbeyond/solid-dnd";
import { Accessor, Component, ParentProps } from "solid-js";
import { PomodoroType } from "../types/pomodoro";
import styles from "./PomodoroItem.module.css";
import { classNames } from "./UI/utils/classNames";

type Props = ParentProps<
  PomodoroType & {
    handleActive: () => void;
    activePomodoro: Accessor<PomodoroType | null>;
  }
>;

export const PomodoroItem: Component<Props> = (props) => {
  const { _id, title, children, handleActive, activePomodoro, done } = props;

  return (
    <div
      class={
        activePomodoro()?._id == _id
          ? !done
            ? classNames(styles.PomodoroItem, "sortable", styles.ActivePomodoro)
            : classNames(
                styles.Done,
                styles.PomodoroItem,
                "sortable",
                styles.ActivePomodoro
              )
          : !done
          ? classNames(styles.PomodoroItem, "sortable")
          : classNames(styles.Done, styles.PomodoroItem, "sortable")
      }
      onClick={handleActive}
    >
      <div class={styles.PomodoroTitle}>{title}</div>
      <div class={styles.PomodoroItemActions}>{children} </div>
    </div>
  );
};

export const SortablePomodoroItem: Component<Props> = (props) => {
  const { _id, title, children, handleActive, activePomodoro, done, order } =
    props;

  const sortable = createSortable(`${_id}-${order}`);

  return (
    <div
      use:sortable
      class={
        activePomodoro()?._id == _id
          ? !done
            ? classNames(styles.PomodoroItem, "sortable", styles.ActivePomodoro)
            : classNames(
                styles.Done,
                styles.PomodoroItem,
                "sortable",
                styles.ActivePomodoro
              )
          : !done
          ? classNames(styles.PomodoroItem, "sortable")
          : classNames(styles.Done, styles.PomodoroItem, "sortable")
      }
      onClick={handleActive}
    >
      <div class={styles.PomodoroTitle}>{title}</div>
      <div class={styles.PomodoroActions}>{children}</div>
    </div>
  );
};
