import "./Text.css";
import { Component } from "solid-js";
import { JSX } from "solid-js/web/types/jsx";
import { cx } from "~/ui/utils/cx";
import { FillVariant } from "../Types";

export const Text: Component<{
  children: JSX.Element;
  variant?: FillVariant;
  class?: string;
}> = (props) => (
  <div
    class={cx(
      props.class,
      props.variant ? `text-${props.variant}` : "text-default"
    )}
  >
    {props.children}
  </div>
);
