import "./Text.css";
import "./Label.css";
import { Component, For, JSX, Show } from "solid-js";
import { SizeType, InputVariant } from "../Types";
import { cx } from "~/ui/utils/cx";
import { Text } from "~/ui/components/Text";
import { IconBox } from "./IconBox";

export const Label: Component<{
  children: JSX.Element;
  variant?: InputVariant;
  class?: string;
  label?: JSX.Element;
  size: SizeType;
  error?: Array<string | null>;
  unvalidate?: boolean;
  disabled?: boolean;
  unpadded?: boolean;
  unrounded?: boolean;
}> = (props) => (
  <fieldset
    class={cx(
      props.class,
      !props.unrounded && "radius",
      props.size && `text-${props.size}`,
      !props.unpadded && props.size && `label-${props.size}`,
      props.error !== undefined &&
        !props.unvalidate &&
        (props.error.findIndex((i) => i) === -1 ? "valid" : "invalid"),
      props.disabled
        ? "input-dim"
        : props.variant
        ? `input-${props.variant}`
        : "input-default",
      "flex flex-col items-stretch"
    )}
  >
    <Show when={props.label}>
      <legend
        class={cx(
          !props.unrounded && "radius",
          props.size && `text-${props.size}`,
          "px-1"
        )}
      >
        {props.label}
      </legend>
    </Show>
    {props.children}
    <Show when={props.error}>
      <For each={props.error}>
        {(rule) => (
          <Show when={rule}>
            <div class="flex flex-row items-center gap-1">
              <IconBox
                icon="i-tabler-x"
                size="xs"
                variant="unstyle"
                class="text-red-6"
              />
              <Text variant="invalid">{rule}</Text>
            </div>
          </Show>
        )}
      </For>
    </Show>
  </fieldset>
);
