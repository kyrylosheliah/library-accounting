import "./Text.css";
import "./Input.css";
import { Component, JSX } from "solid-js";
import { SizeType, InputVariant } from "../Types";
import { cx } from "~/ui/utils/cx";

export interface TextAreaProps {
  variant?: InputVariant;
  class?: string;
  attributes?: JSX.TextareaHTMLAttributes<HTMLTextAreaElement>;
  size: SizeType;
  valid?: boolean;
  unpadded?: boolean;
  unrounded?: boolean;
}

export const TextArea: Component<TextAreaProps> = (props) => (
  <textarea
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
