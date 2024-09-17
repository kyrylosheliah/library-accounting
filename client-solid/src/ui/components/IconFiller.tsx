import "./IconBox.css";
import "./IconFiller.css";
import { Component } from "solid-js";
import { SizeType } from "../Types";
import { cx } from "../utils/cx";

export const IconFiller: Component<{
  icon: string;
  size?: SizeType;
  unpadded?: boolean;
}> = (props) => (
  <div
    class={cx(
      props.icon,
      "iconfiller",
      props.unpadded ? (props.size ? `box-${props.size}` : "") : "w-2/3 h-2/3"
    )}
  />
);
