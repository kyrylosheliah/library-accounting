import { Component, For } from "solid-js";
import { PaginationHookProps, usePagination } from "../hooks/usePagination";
import { IconBox } from "./IconBox";
import { ButtonVariant, SizeType } from "../Types";
import { IconButton } from "./IconButton";
import { ButtonBox } from "./ButtonBox";

export const Pagination: Component<
  PaginationHookProps & {
    class?: string;
    size: SizeType;
    variant?: ButtonVariant;
    activeVariant?: ButtonVariant;
  }
> = (props) => {
  const { range, set, previous, next } = usePagination(props);
  return (
    <div class={props.class}>
      <For each={range()}>
        {(item) => {
          switch (item) {
            case "spacer":
              return (
                <IconBox
                  icon="i-tabler-dots"
                  size={props.size}
                  variant={props.variant}
                  bgless
                />
              );
            case "previous":
              return (
                <IconButton
                  icon="i-tabler-chevron-left"
                  size={props.size}
                  variant={props.variant}
                  attributes={{ onClick: previous }}
                />
              );
            case "next":
              return (
                <IconButton
                  icon="i-tabler-chevron-right"
                  size={props.size}
                  variant={props.variant}
                  attributes={{ onClick: next }}
                />
              );
            default:
              return (
                <ButtonBox
                  size={props.size}
                  variant={
                    item === props.state.get()
                      ? props.activeVariant
                      : props.variant
                  }
                  attributes={{
                    onClick:
                      item === props.state.get() ? undefined : () => set(item),
                  }}
                >
                  {item}
                </ButtonBox>
              );
          }
        }}
      </For>
    </div>
  );
};
