import { Component, JSX, Show } from "solid-js";
import { themep } from "~/ui/Theme";
import { Card } from "~/ui/components/Card";
import { Divider } from "~/ui/components/Divider";
import { cx } from "~/ui/utils/cx";

type SectionCardProps = {
  class?: string;
  children: JSX.Element;
  header?: JSX.Element;
  footer?: JSX.Element;
};

export const SectionCard: Component<SectionCardProps> = (props) => (
  <Card
    class={cx(props.class, themep.default.bg, "flex flex-col align-stretch")}
  >
    <Show when={props.header}>
      {props.header}
      <Divider variant="dim" class="h-px w-full" />
    </Show>
    {props.children}
    <Show when={props.footer}>
      <Divider variant="dim" class="h-px w-full" />
      {props.footer}
    </Show>
  </Card>
);
