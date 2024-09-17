import "./Breadcrumbs.css";
import { Component, For, Show } from "solid-js";
import { useBreadcrumbs } from "~/hooks/useBreadcrumbs";
import { AnchorButton } from "~/ui/components/AnchorButton";
import { Text } from "~/ui/components/Text";
import { cx } from "~/ui/utils/cx";

export const Breadcrumbs: Component<{ class?: string }> = (props) => {
  const breadcrumbs = useBreadcrumbs();
  return (
    <div class={cx(props.class, "text-xs")}>
      <For each={breadcrumbs()}>
        {(breadcrumb, index) => (
          <Show
            when={index() !== breadcrumbs().length - 1}
            fallback={<Text class="px-3 breadcrumb">{breadcrumb.title}</Text>}
          >
            <AnchorButton
              unpadded
              unrounded
              class="px-3 breadcrumb"
              href={breadcrumb.href}
              children={breadcrumb.title}
            />
            <Text class="breadcrumb">{"/"}</Text>
          </Show>
        )}
      </For>
    </div>
  );
};
