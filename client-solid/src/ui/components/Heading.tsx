import "./Heading.css";
import { Component } from "solid-js";
import { Dynamic } from "solid-js/web";
import { JSX } from "solid-js/web/types/jsx";
import { cx } from "~/ui/utils/cx";
import { FillVariant, HeadingLevel } from "../Types";

export const Heading: Component<{
  children: JSX.Element;
  order: HeadingLevel;
  variant?: FillVariant;
  class?: string;
}> = (props) => (
  <Dynamic
    component={`h${props.order}`}
    class={cx(
      props.class,
      `h${props.order}`,
      props.variant ? `text-${props.variant}` : "text-default"
    )}
  >
    {props.children}
  </Dynamic>
);
