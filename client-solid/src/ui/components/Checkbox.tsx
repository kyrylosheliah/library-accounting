import "./Checkbox.css";
import {
  Component,
  JSX,
  createEffect,
  createSignal,
  on,
  onMount,
} from "solid-js";
import { SizeType, CheckboxVariant } from "../Types";
import { cx } from "~/ui/utils/cx";

export interface CheckboxProps {
  variant?: CheckboxVariant;
  class?: string;
  attributes?: JSX.InputHTMLAttributes<HTMLInputElement>;
  size: SizeType;
  valid?: boolean;
  indeterminate?: boolean;
  unpadded?: boolean;
  unrounded?: boolean;
}

export const Checkbox: Component<CheckboxProps> = (props) => {
  let inputRef: HTMLInputElement;
  let buttonRef: HTMLButtonElement;
  const [checked, setChecked] = createSignal(
    props.attributes?.checked || false
  );

  onMount(() => {
    buttonRef.addEventListener("click", () => {
      if (props.attributes?.checked === undefined) {
        inputRef.checked = !inputRef.checked;
        setChecked(inputRef.checked);
      }
      if (props.attributes !== undefined) {
        if (props.attributes.onClick !== undefined) {
          inputRef.click();
        }
      }
    });
    if (props.indeterminate !== undefined) {
      inputRef.indeterminate = props.indeterminate;
    }
  });

  createEffect(
    on(
      () => props.indeterminate,
      () => {
        inputRef.checked = false;
        setChecked(false);
        if (props.indeterminate !== undefined) {
          inputRef.indeterminate = props.indeterminate;
        }
      }
    )
  );

  createEffect(
    on(
      () => props.attributes?.checked,
      () => {
        const state = props.attributes?.checked || false;
        inputRef.checked = state;
        setChecked(state);
      }
    )
  );

  return (
    <button
      ref={buttonRef!}
      type="button"
      disabled={props.attributes?.disabled}
      class={cx(
        props.class,
        props.size && `box-${props.size}`,
        !props.unrounded && "radius",
        props.valid !== undefined && (props.valid ? "valid" : "invalid"),
        props.attributes?.disabled
          ? "checkbox-dim"
          : checked()
          ? props.variant
            ? `checkbox-${props.variant}`
            : "checkbox-default"
          : "checkbox",
        "relative shrink-0"
      )}
    >
      <input
        ref={inputRef!}
        {...props.attributes}
        type="checkbox"
        class="peer appearance-none"
      />
      <div
        class={cx(
          "check-filler",
          props.indeterminate
            ? "i-tabler-minus peer-indeterminate:block"
            : "i-tabler-check peer-checked:block",
          !props.unpadded && "w-4/5 h-4/5"
        )}
      />
    </button>
  );
};
