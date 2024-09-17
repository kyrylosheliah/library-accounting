import { Accessor, Setter, createEffect, createSignal } from "solid-js";
import { isServer } from "solid-js/web";

export const useLocalStore = <T>(
  key: string,
  defaultState: T
): [Accessor<T>, Setter<T>] => {
  let initState: T;
  try {
    initState = isServer ? undefined : JSON.parse(localStorage[key]);
  } catch (e) {
    initState = defaultState;
  }
  const [state, setState] = createSignal(initState);
  createEffect(() => {
    localStorage[key] = JSON.stringify(state());
  });
  return [state, setState];
};
