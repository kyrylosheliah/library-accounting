import "./IconBox.css";
import { Component } from "solid-js";
import { SizeType, ButtonVariant } from "../Types";
import { cx } from "~/ui/utils/cx";
import { IconFiller } from "./IconFiller";

export const IconBox: Component<{
  class?: string;
  icon: string;
  size?: SizeType;
  variant?: ButtonVariant;
  unpadded?: boolean;
  unrounded?: boolean;
  disabled?: boolean;
  bgless?: boolean;
}> = (props) => (
  <div
    class={cx(
      props.class,
      !props.unrounded && "radius",
      props.size && `box-${props.size}`,
      props.variant ? `iconbox-${props.variant}` : "iconbox-default",
      props.bgless && "bgless",
      "relative"
    )}
  >
    <IconFiller icon={props.icon} size={props.size} unpadded={props.unpadded} />
  </div>
);
