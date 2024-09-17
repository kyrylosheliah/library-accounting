import "./Anchor.css";
import { A } from "solid-start";
import { Component, JSX } from "solid-js";
import { AnchorVariant } from "../Types";
import { cx } from "../utils/cx";

export const Anchor: Component<{
  children: JSX.Element;
  href: string;
  variant?: AnchorVariant;
  class?: string;
}> = (props) => (
  <A
    href={props.href}
    class={cx(
      props.class,
      props.variant ? `anchor-${props.variant}` : "anchor-default"
    )}
  >
    {props.children}
  </A>
);
