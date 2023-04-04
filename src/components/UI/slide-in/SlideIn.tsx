import { ParentProps } from "solid-js";

type Props = ParentProps<{ showEdit: boolean }>;

function SlideIn(props: Props) {
  return (
    <div
      style={{
        width: props.showEdit ? 0 : "100%",
        "max-height": props.showEdit ? 0 : "30rem",
        display: "flex",
        "justify-content": "space-between",
        "flex-direction": "column",
        transition: "all  40ms ease-out",
      }}
    >
      {props.children}
    </div>
  );
}

export default SlideIn;
