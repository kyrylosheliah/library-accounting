import "./IconBox.css";
import "./Button.css";
import { Component, JSX } from "solid-js";
import { cx } from "~/ui/utils/cx";
import { IconFiller } from "./IconFiller";
import { SizeType, ButtonVariant } from "../Types";

export const IconButton: Component<{
  class?: string;
  icon: string;
  size?: SizeType;
  variant?: ButtonVariant;
  attributes?: JSX.ButtonHTMLAttributes<HTMLButtonElement>;
  unpadded?: boolean;
  unrounded?: boolean;
}> = (props) => (
  <button
    {...props.attributes}
    type={props.attributes?.type ? props.attributes.type : "button"}
    class={cx(
      props.class,
      !props.unrounded && "radius",
      props.size && `box-${props.size}`,
      props.attributes?.disabled
        ? "button-dim"
        : props.variant
        ? `button-${props.variant}`
        : "button-default",
      "relative"
    )}
  >
    <IconFiller icon={props.icon} size={props.size} unpadded={props.unpadded} />
  </button>
);
