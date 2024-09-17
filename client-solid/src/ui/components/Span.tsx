import { Component, JSX } from "solid-js";
import { FillVariant, SizeType } from "../Types";
import { cx } from "../utils/cx";

export const Span: Component<{
  children: JSX.Element;
  variant?: FillVariant;
  class?: string;
  size?: SizeType;
}> = (props) => (
  <span
    class={cx(
      props.class,
      props.size && `text-${props.size}`,
      props.variant ? `text-${props.variant}` : "text-default"
    )}
  >
    {props.children}
  </span>
);
