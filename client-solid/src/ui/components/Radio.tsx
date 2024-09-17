import "./IconBox.css";
import "./Radio.css";
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

export const Radio: Component<{
  variant?: CheckboxVariant;
  class?: string;
  attributes?: JSX.InputHTMLAttributes<HTMLInputElement>;
  size: SizeType;
  valid?: boolean;
  unpadded?: boolean;
  indeterminate?: boolean;
}> = (props) => {
  let inputRef: HTMLInputElement;
  let buttonRef: HTMLButtonElement;
  const [checked, setChecked] = createSignal(
    props.attributes?.checked || false
  );

  onMount(() => {
    inputRef.addEventListener("updatebyname", () => {
      setChecked(inputRef.checked);
    });
    buttonRef.addEventListener("click", () => {
      if (props.attributes?.checked === undefined) {
        inputRef.checked = true;
        setChecked(inputRef.checked);
        const name = props.attributes?.name;
        if (name) {
          document.getElementsByName(name).forEach((elem) => {
            elem.dispatchEvent(new Event("updatebyname"));
          });
        }
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
        // const name = props.attributes?.name;
        // if (name) {
        //   document.getElementsByName(name).forEach((elem) => {
        //     elem.dispatchEvent(new Event("updatebyname"));
        //   });
        // }
      }
    )
  );

  return (
    <button
      ref={buttonRef!}
      type="button"
      class={cx(
        props.class,
        `box-${props.size}`,
        props.valid !== undefined && (props.valid ? "valid" : "invalid"),
        props.attributes?.disabled
          ? "radio-b-dim"
          : checked()
          ? props.variant
            ? `radio-b-${props.variant}`
            : "radio-b-default"
          : "radio-b",
        "relative shrink-0 rounded-full"
      )}
    >
      <input
        {...props.attributes}
        ref={inputRef!}
        type="radio"
        class="peer appearance-none"
      />
      <div
        class={cx(
          "radio-filler",
          props.indeterminate !== undefined
            ? cx(
                "i-tabler-minus",
                !props.unpadded && "w-4/5 h-4/5",
                props.attributes?.disabled
                  ? "radio-i-dim"
                  : props.indeterminate && props.variant
                  ? `radio-i-${props.variant}`
                  : "radio-i-default",
                "peer-indeterminate:block"
              )
            : cx(
                !props.unpadded && "w-2/3 h-2/3",
                props.attributes?.disabled
                  ? "radio-d-dim"
                  : checked() && props.variant
                  ? `radio-d-${props.variant}`
                  : "radio-d-default",
                "rounded-full peer-checked:block"
              )
        )}
      />
    </button>
  );
};
