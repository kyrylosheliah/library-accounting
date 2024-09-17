import "./Accordion.css";
import { For, JSX, Show, createSignal } from "solid-js";
import { cx } from "../utils/cx";
import { Button } from "./Button";
import { ButtonVariant } from "../Types";
import { Divider } from "./Divider";

export type AccordionTabData = {
  title: JSX.Element;
  drawer: JSX.Element;
};
export type AccordionTab = {
  title: () => JSX.Element;
  drawer: () => JSX.Element;
};

interface AccordionProps {
  class?: string;
  titleClass?: string;
  titleVariant?: ButtonVariant;
  drawerClass?: string;
  radio?: boolean;
  group?: boolean;
  data: AccordionTab[];
  icon?: () => JSX.Element;
  iconLeft?: boolean;
  iconClass?: string;
}

export function Accordion(props: AccordionProps) {
  const [opened, setOpened] = createSignal<number[]>([]);
  const [hovered, setHovered] = createSignal<number | undefined>();
  const toggle = props.radio
    ? (tabIndex: number) =>
        setOpened(opened().includes(tabIndex) ? [] : [tabIndex])
    : (tabIndex: number) =>
        setOpened((prev) => {
          const foundIndex = opened().indexOf(tabIndex);
          return foundIndex === -1
            ? [...prev, tabIndex]
            : foundIndex < prev.length - 1
            ? [...prev.slice(0, foundIndex), ...prev.slice(foundIndex + 1)]
            : [...prev.slice(0, foundIndex)];
        });
  const hasBorder = () =>
    props.titleVariant === "border" || props.titleVariant === "outline";
  return (
    <div class={cx(props.class, "flex flex-col items-stretch")}>
      <For each={props.data}>
        {(tab, tabIndex) =>
          (() => {
            const index = tabIndex();
            const prevIndex = index - 1;
            const nextIndex = index + 1;
            const isFirst = index === 0;
            const isLast = index === props.data.length - 1;
            const isOpened = () => opened().includes(index);
            const isPrevOpened = () => opened().includes(prevIndex);
            const isHovered = () => hovered() === index;
            const isNextHovered = () => hovered() === nextIndex;
            return (
              <div class="flex flex-col items-stretch">
                <Button
                  attributes={{
                    onClick: () => toggle(index),
                    onMouseEnter: () => setHovered(index),
                    onMouseLeave: () => setHovered(undefined),
                  }}
                  class={cx(
                    props.titleClass,
                    props.group &&
                      hasBorder() &&
                      cx(
                        !(isFirst || isPrevOpened()) &&
                          "border-t-none! hover:border-t-solid!",
                        !(isLast || isOpened()) &&
                          "border-b-none! hover:border-b-solid!"
                      ),
                    props.group &&
                      cx(
                        (isFirst || isPrevOpened()) && "radius-top",
                        (isLast || isOpened()) && "radius-bottom"
                      ),
                    props.icon &&
                      cx(
                        "flex items-center",
                        props.iconLeft
                          ? "flex-row-reverse justify-end"
                          : "flex-row justify-between"
                      )
                  )}
                  variant={props.titleVariant}
                  unrounded={props.group}
                  children={[
                    tab.title(),
                    props.icon && (
                      <div
                        class={cx(
                          props.iconClass,
                          isOpened() &&
                            (props.iconLeft ? "-rotate-90" : "rotate-90")
                        )}
                        children={props.icon()}
                      />
                    ),
                  ]}
                />
                <Show
                  when={
                    props.group &&
                    hasBorder() &&
                    !(isLast || isOpened() || isHovered() || isNextHovered())
                  }
                >
                  <Divider
                    variant={props.titleVariant === "border" ? "dim" : "color"}
                    class="w-full h-px"
                  />
                </Show>
                <Show when={isOpened()}>
                  <div
                    class={cx(
                      props.drawerClass,
                      props.group && isLast ? "radius-bottom" : undefined
                    )}
                    children={tab.drawer()}
                  />
                </Show>
              </div>
            );
          })()
        }
      </For>
    </div>
  );
}
