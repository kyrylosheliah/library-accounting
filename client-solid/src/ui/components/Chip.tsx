import "./Chip.css";
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

export const Chip: Component<{
  variant?: CheckboxVariant;
  children?: string;
  icon?: string;
  class?: string;
  attributes?: JSX.InputHTMLAttributes<HTMLInputElement>;
  size?: SizeType;
  valid?: boolean;
  unpadded?: boolean;
  unrounded?: boolean;
}> = (props) => {
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
  });

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
      class={cx(
        props.class,
        props.size &&
          cx(`chip-s-${props.size}`, !props.unpadded && `chip-p-${props.size}`),
        !props.unrounded && "radius",
        props.valid !== undefined && (props.valid ? "valid" : "invalid"),
        props.attributes?.disabled
          ? "checkbox-dim"
          : checked()
          ? props.variant
            ? `checkbox-${props.variant}`
            : "checkbox-default"
          : "checkbox",
        "flex flex-row items-center"
      )}
    >
      <input
        ref={inputRef!}
        {...props.attributes}
        type="checkbox"
        class="peer appearance-none"
      />
      <div class={`chip-t-p-${props.size}`}>{props.children}</div>
    </button>
  );
};
