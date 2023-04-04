import { ParentProps } from "solid-js";
import classes from "./SlideIn.module.css";

type Props = ParentProps<{ showEdit: boolean }>;

function SlideIn(props: Props) {
  return (
    <div
      class={classes.slideIn}
      style={{
        width: props.showEdit ? 0 : "100%",
        "max-height": props.showEdit ? 0 : "30rem",
      }}
    >
      {props.children}
    </div>
  );
}

export default SlideIn;
