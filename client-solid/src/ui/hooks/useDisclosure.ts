import { Accessor, createSignal } from "solid-js";

export const useDisclosure = (
  initialState: boolean
): [
  Accessor<boolean>,
  { open: () => void; close: () => void; toggle: () => void }
] => {
  const [opened, setOpened] = createSignal(initialState);
  const open = () => setOpened(true);
  const close = () => setOpened(false);
  const toggle = () => setOpened(!opened());
  return [opened, { open, close, toggle }];
};
