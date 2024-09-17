import { Accessor, createEffect, createSignal, on, onCleanup } from "solid-js";

export function useDebounce<T>(
  value: Accessor<T>,
  delay?: number
): Accessor<T> {
  const [debouncedValue, setDebouncedValue] = createSignal<T>(value());

  let timeout: NodeJS.Timeout;

  createEffect(
    on(value, () => {
      timeout = setTimeout(() => {
        setDebouncedValue(value);
      }, delay || 1000);
      onCleanup(() => clearTimeout(timeout));
    })
  );

  return debouncedValue;
}
