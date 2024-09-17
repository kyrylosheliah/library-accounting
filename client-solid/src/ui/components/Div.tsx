import { FillVariant } from "../Types";
import { cx } from "../utils/cx";
import "./Div.css";
import { Component, JSX } from "solid-js";

export const Div: Component<{
  children: JSX.Element;
  class?: string;
  variant?: FillVariant;
}> = (props) => (
  <div
    class={cx(
      props.class,
      props.variant ? `div-${props.variant}` : "div-default"
    )}
    children={props.children}
  />
);
