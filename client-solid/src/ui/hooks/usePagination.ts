import { Accessor, Setter, createEffect, createSignal } from "solid-js";

type PaginationButtonType = number | "spacer" | "previous" | "next";

const clip = (value: number, total: number) =>
  total < 1 ? 1 : value < 1 ? 1 : value > total ? total : value;

export type PaginationHookProps = {
  state: { get: Accessor<number>; set: Setter<number> };
  total: Accessor<number>;
  neighbours?: number;
  singleStep?: boolean;
  edgeStep?: boolean;
};

export const usePagination = (
  props: PaginationHookProps
): {
  range: Accessor<Array<PaginationButtonType>>;
  set: (value: number) => void;
  previous: () => void;
  next: () => void;
} => {
  props.state.set(clip(props.state.get(), props.total()));
  const updateRange = (): Array<PaginationButtonType> => {
    let leftRange: Array<PaginationButtonType> = [];
    let rightRange: Array<PaginationButtonType> = [];
    const total = props.total();
    const page = props.state.get();
    if (props.singleStep) {
      if (page >= 2) {
        leftRange.push("previous");
      }
      if (page <= total - 1) {
        rightRange.push("next");
      }
    }
    const neighbours =
      props.neighbours === undefined || props.neighbours < 0
        ? 2
        : props.neighbours;
    let left = page - neighbours;
    if (left >= 3) {
      if (props.edgeStep) {
        leftRange.push(1);
      }
      leftRange.push("spacer");
    } else if (left === 2) {
      if (props.edgeStep) {
        leftRange.push(1);
      } else {
        leftRange.push("spacer");
      }
    } else if (left < 1) {
      left = 1;
    }
    let right = page + neighbours;
    if (right <= total - 2) {
      if (props.edgeStep) {
        rightRange.push(total);
      }
      rightRange.push("spacer");
    } else if (right === total - 1) {
      if (props.edgeStep) {
        rightRange.push(total);
      } else {
        rightRange.push("spacer");
      }
    } else if (right > total) {
      right = total;
    }
    return [
      ...leftRange,
      ...Array.from({ length: right - left + 1 }, (_, index) => index + left),
      ...rightRange.reverse(),
    ];
  };
  const [range, setRange] = createSignal<Array<PaginationButtonType>>(
    updateRange()
  );
  createEffect(() => {
    setRange(updateRange);
  });
  const set = (value: number) => props.state.set(clip(value, props.total()));
  const previous = () => props.state.set((prev) => (prev < 2 ? 1 : prev - 1));
  const next = () =>
    props.state.set((prev) =>
      prev > props.total() - 1 ? props.total() : prev + 1
    );
  return { range, set, previous, next };
};
