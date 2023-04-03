import { PomodoroFocusType } from "../../../types/pomodoro";
import { classNames } from "../utils/classNames";
import styles from "./Background.module.css";

type Props = {
  pomodoroState: PomodoroFocusType;
};

function Background(props: Props) {
  return (
    <div
      class={
        props.pomodoroState === "Focus"
          ? styles.Background
          : classNames(styles.Background, styles.BlueBackground)
      }
    />
  );
}

export default Background;
