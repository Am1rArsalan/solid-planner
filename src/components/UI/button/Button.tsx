import { Component, mergeProps, splitProps } from "solid-js";
import styles from "./Button.module.css";
import { classNames } from "../utils/classNames";
import { ElementType, HtmlProps } from "../../../types/ui";

export type ButtonProps<C extends ElementType = "button"> = HtmlProps<C>;

export const Button: Component<ButtonProps> = (props) => {
  const { children } = props;

  const propsWithDefault: ButtonProps<"button"> = mergeProps(props);
  const [local, _, others] = splitProps(
    propsWithDefault,
    ["class", "disabled"],
    ["children"]
  );

  const classes = () => {
    return classNames(styles.Button, local.class);
  };

  return (
    <button class={classes()} {...others}>
      {children}
    </button>
  );
};
