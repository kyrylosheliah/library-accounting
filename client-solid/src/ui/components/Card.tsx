import "./Card.css";
import { Component } from "solid-js";
import { cx } from "../utils/cx";
import { JSX } from "solid-js/web/types/jsx";

export const Card: Component<{
  children: JSX.Element;
  class?: string;
  unrounded?: boolean;
}> = (props) => (
  <div class={cx(props.class, !props.unrounded && "radius", "card")}>
    {props.children}
  </div>
);
