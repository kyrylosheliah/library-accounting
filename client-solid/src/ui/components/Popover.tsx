import { Accessor, Component, JSX, Show, createSignal } from "solid-js";
import { useAnchorElement } from "../hooks/useAnchorElement";
import { cx } from "../utils/cx";
import { PositionCoord } from "../Types";
import { useDisclosure } from "../hooks/useDisclosure";

export const Popover: Component<{
  class?: string;
  targetWrapperClass?: string;
  popoverWrapperClass?: string;
  hover?: boolean;
  stickyParent?: boolean;
  coord: Accessor<PositionCoord>;
  target: JSX.Element;
  popover: JSX.Element;
  controlled?: [
    Accessor<boolean>,
    {
      open: () => void;
      close: () => void;
      toggle: () => void;
    }
  ];
}> = (props) => {
  const state = props.controlled || useDisclosure(false);
  const [anchor, setAnchor] = createSignal<HTMLDivElement | undefined>(
    undefined
  );
  const [popover, setPopover] = createSignal<HTMLDivElement | undefined>(
    undefined
  );
  const position = useAnchorElement(
    anchor,
    popover,
    props.coord,
    props.stickyParent
  );

  return (
    <div
      class={cx(props.class, "inline-block")}
      onMouseEnter={props.hover ? state[1].open : undefined}
      onMouseLeave={props.hover ? state[1].close : undefined}
    >
      <div
        ref={setAnchor}
        class={cx(props.targetWrapperClass, "inline-block")}
        onClick={props.hover ? undefined : state[1].toggle}
      >
        {props.target}
      </div>
      <Show when={state[0]()}>
        <div
          ref={setPopover}
          class={cx(props.popoverWrapperClass, "absolute z-10 inline-block")}
          style={
            position() !== undefined
              ? { left: `${position()!.left}px`, top: `${position()!.top}px` }
              : undefined
          }
        >
          {props.popover}
        </div>
      </Show>
    </div>
  );
};
