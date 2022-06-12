import { Component, mergeProps, splitProps } from "solid-js";
import styles from "./Button.module.css";
import { classNames } from "../utils/classNames";
import { ElementType, HtmlProps } from "../../../types/ui";

export type IconButtonProps<C extends ElementType = "button"> = HtmlProps<C>;

export const IconButton: Component<IconButtonProps> = (props) => {
  const { children } = props;

  const propsWithDefault: IconButtonProps<"button"> = mergeProps(props);

  const [local, _, others] = splitProps(
    propsWithDefault,
    ["class", "disabled"],
    ["children"]
  );

  const classes = () => {
    return classNames(styles.IconButton, local.class);
  };

  return (
    <button class={classes()} disabled={local.disabled} {...others}>
      {children}
    </button>
  );
};
