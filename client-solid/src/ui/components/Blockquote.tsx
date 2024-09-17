import { IconBox } from "./IconBox";
import { Text } from "~/ui/components/Text";
import { Component } from "solid-js";
import { cx } from "~/ui/utils/cx";

export const Blockquote: Component<{
  text: string;
  author: string;
  class?: string;
}> = (props) => (
  <blockquote class={cx(props.class, "max-w-2xl block")}>
    <div class="flex flex-row gap-3">
      <IconBox
        icon="i-tabler-quote"
        size="md"
        unpadded
        class="mt-3 mr-3 shrink-0"
      />
      <Text class="sm:text-xl text-justify">{props.text}</Text>
    </div>
    <Text variant="dim" class="mt-3 text-right">
      <em>{props.author}</em>
    </Text>
  </blockquote>
);
