import "./Text.css";
import "./Button.css";
import "./ButtonBox.css";
import { Component, JSX } from "solid-js";
import { SizeType, ButtonVariant } from "../Types";
import { cx } from "~/ui/utils/cx";

export const ButtonBox: Component<{
  children: JSX.Element;
  class?: string;
  size: SizeType;
  variant?: ButtonVariant;
  attributes?: JSX.ButtonHTMLAttributes<HTMLButtonElement>;
  unpadded?: boolean;
  unrounded?: boolean;
}> = (props) => {
  return (
    <button
      {...props.attributes}
      type={props.attributes?.type ? props.attributes.type : "button"}
      class={cx(
        props.class,
        !props.unrounded && "radius",
        props.size && `text-${props.size}`,
        !props.unpadded && `buttonbox-${props.size}`,
        props.attributes?.disabled
          ? "button-dim"
          : props.variant
          ? `button-${props.variant}`
          : "button-default"
      )}
    >
      {props.children}
    </button>
  );
};
