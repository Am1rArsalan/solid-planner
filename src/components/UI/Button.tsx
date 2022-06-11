import { Component, ComponentProps, JSX, ParentProps } from "solid-js";
import styles from "./Button.module.css";

export type DOMElements = keyof JSX.IntrinsicElements;

export type ElementType<Props = any> = DOMElements | Component<Props>;

export type PropsOf<C extends ElementType> = ComponentProps<C>;

export type OverrideProps<Source = {}, Override = {}> = Omit<
  Source,
  keyof Override
> &
  Override;

export type HTMLHopeProps<
  C extends ElementType,
  AdditionalProps = {}
> = OverrideProps<ParentProps<PropsOf<C>>, AdditionalProps & { as?: C }>;

export type ButtonProps<C extends ElementType = "button"> = HTMLHopeProps<C>;

const Button: Component<ButtonProps> = (props) => {
  const { children, ...rest } = props;

  const propsWithDefault: ButtonProps<"button"> = mergeProps(
    defaultProps,
    props
  );
  const [local, contentProps, others] = splitProps(
    propsWithDefault,
    [
      "class",
      "disabled",
      "loadingText",
      "loader",
      "loaderPlacement",
      "variant",
      "colorScheme",
      "size",
      "loading",
      "compact",
      "fullWidth",
    ],
    ["children", "iconSpacing", "leftIcon", "rightIcon"]
  );

  const classes = () => {
    return classNames(
      local.class,
      hopeButtonClass,
      buttonStyles({
        variant:
          local.variant ??
          buttonGroupContext?.state.variant ??
          theme?.defaultProps?.root?.variant ??
          "solid",
        colorScheme:
          local.colorScheme ??
          buttonGroupContext?.state.colorScheme ??
          theme?.defaultProps?.root?.colorScheme ??
          "primary",
        size:
          local.size ??
          buttonGroupContext?.state.size ??
          theme?.defaultProps?.root?.size ??
          "md",
        loading: local.loading,
        compact: local.compact,
        fullWidth: local.fullWidth,
      })
    );
  };

  return (
    <button
      //<hope.button
      //class={classes()}
      //disabled={disabled()}
      //__baseStyle={theme?.baseStyle?.root}
      //{...others}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;

export function classNames(...classNames: Array<string | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

//return (
//>
//<Show when={local.loading && local.loaderPlacement === "start"}>
//<ButtonLoader
//class="hope-button__loader--start"
//withLoadingText={!!local.loadingText}
//placement="start"
//spacing={contentProps.iconSpacing}
//>
//{local.loader}
//</ButtonLoader>
//</Show>

//<Show when={local.loading} fallback={<ButtonContent {...contentProps} />}>
//<Show
//when={local.loadingText}
//fallback={
//<hope.span opacity={0}>
//<ButtonContent {...contentProps} />
//</hope.span>
//}
//>
//{local.loadingText}
//</Show>
//</Show>

//<Show when={local.loading && local.loaderPlacement === "end"}>
//<ButtonLoader
//class="hope-button__loader--end"
//withLoadingText={!!local.loadingText}
//placement="end"
//spacing={contentProps.iconSpacing}
//>
//{local.loader}
//</ButtonLoader>
//</Show>
//</hope.button>
//);
//}
