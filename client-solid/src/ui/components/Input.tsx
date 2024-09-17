import "./Input.css";
import "./Text.css";
import { Component, JSX } from "solid-js";
import { SizeType, InputVariant } from "../Types";
import { cx } from "~/ui/utils/cx";

export interface InputProps {
  variant?: InputVariant;
  class?: string;
  attributes?: JSX.InputHTMLAttributes<HTMLInputElement>;
  size: SizeType;
  valid?: boolean;
  unpadded?: boolean;
  unrounded?: boolean;
}

export const Input: Component<InputProps> = (props) => (
  <input
    {...props.attributes}
    class={cx(
      props.class,
      !props.unrounded && "radius",
      props.size && `text-${props.size}`,
      !props.unpadded && props.size && `input-${props.size}`,
      props.valid !== undefined && (props.valid ? "valid" : "invalid"),
      props.attributes?.disabled
        ? "input-dim"
        : props.variant
        ? `input-${props.variant}`
        : "input-default"
    )}
  />
);
