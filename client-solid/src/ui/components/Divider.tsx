import "./Divider.css";
import { Component } from "solid-js";
import { cx } from "~/ui/utils/cx";
import { FillVariant } from "../Types";

export const Divider: Component<{
  variant?: FillVariant;
  class?: string;
}> = (props) => (
  <div class={cx(props.class, props.variant && `divider-${props.variant}`)} />
);
