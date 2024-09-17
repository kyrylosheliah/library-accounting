import "./Button.css";
import "./Text.css";
import { A } from "solid-start";
import { Component, JSX } from "solid-js";
import { ButtonVariant, SizeType } from "../Types";
import { cx } from "../utils/cx";

export const AnchorButton: Component<{
  children: JSX.Element;
  class?: string;
  size?: SizeType;
  variant?: ButtonVariant;
  href: string;
  title?: string;
  unpadded?: boolean;
  unrounded?: boolean;
  unstyled?: boolean;
}> = (props) => (
  <A
    title={props.title}
    href={props.href}
    class={cx(
      props.class,
      !props.unrounded && "radius",
      props.size && `text-${props.size}`,
      !props.unpadded && props.size && `button-${props.size}`,
      !props.unstyled && props.variant
        ? `button-${props.variant}`
        : "button-default"
    )}
  >
    {props.children}
  </A>
);
