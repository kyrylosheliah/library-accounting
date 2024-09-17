import "./IconBox.css";
import "./Button.css";
import { A } from "solid-start";
import { Component } from "solid-js";
import { ButtonVariant, SizeType } from "../Types";
import { cx } from "../utils/cx";
import { IconFiller } from "./IconFiller";

export const AnchorIcon: Component<{
  class?: string;
  icon: string;
  size?: SizeType;
  variant?: ButtonVariant;
  href: string;
  title?: string;
  unpadded?: boolean;
  unrounded?: boolean;
}> = (props) => (
  <A
    title={props.title}
    href={props.href}
    type="button"
    class={cx(
      props.class,
      !props.unrounded && "radius",
      props.size && `box-${props.size}`,
      props.variant ? `button-${props.variant}` : "button-default",
      "relative"
    )}
  >
    <IconFiller icon={props.icon} size={props.size} unpadded={props.unpadded} />
  </A>
);
