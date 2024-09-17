import "./Modal.css";
import { Accessor, Component, JSX, Show } from "solid-js";
import { cx } from "../utils/cx";

export const Modal: Component<{
  children: JSX.Element;
  opened: Accessor<boolean>;
  class?: string;
}> = (props) => (
  <Show when={props.opened()}>
    <div class={cx(props.class, "modal")}>{props.children}</div>
  </Show>
);
