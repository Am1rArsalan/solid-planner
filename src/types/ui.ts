import { Component, ComponentProps, JSX, ParentProps } from "solid-js";

export type DOMElements = keyof JSX.IntrinsicElements;

export type ElementType<Props = any> = DOMElements | Component<Props>;

export type PropsOf<C extends ElementType> = ComponentProps<C>;

export type OverrideProps<Source = {}, Override = {}> = Omit<
  Source,
  keyof Override
> &
  Override;

export type HtmlProps<
  C extends ElementType,
  AdditionalProps = {}
> = OverrideProps<ParentProps<PropsOf<C>>, AdditionalProps>;
