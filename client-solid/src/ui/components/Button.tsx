import "./Button.css";
import "./Text.css";
import { Component, JSX } from "solid-js";
import { SizeType, ButtonVariant } from "../Types";
import { cx } from "~/ui/utils/cx";

export const Button: Component<{
  children: JSX.Element;
  class?: string;
  size?: SizeType;
  variant?: ButtonVariant;
  attributes?: JSX.ButtonHTMLAttributes<HTMLButtonElement>;
  unpadded?: boolean;
  unrounded?: boolean;
  unstyled?: boolean;
}> = (props) => {
  return (
    <button
      {...props.attributes}
      type={props.attributes?.type ? props.attributes.type : "button"}
      class={cx(
        props.class,
        !props.unrounded && "radius",
        props.size && `text-${props.size}`,
        !props.unpadded && props.size && `button-${props.size}`,
        !props.unstyled &&
          (props.attributes?.disabled
            ? "button-dim"
            : props.variant
            ? `button-${props.variant}`
            : "button-default")
      )}
    >
      {props.children}
    </button>
  );
};
