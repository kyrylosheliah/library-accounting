import { Accessor, createEffect, createSignal } from "solid-js";
import { isServer } from "solid-js/web";
import { PositionCoord, PositionTopLeft } from "../Types";

const CalculateAnchorPoint = (
  anchorElement: Element | undefined,
  popoverElement: Element | undefined,
  coord: PositionCoord,
  stickyParent?: boolean
): PositionTopLeft | undefined => {
  const anchorRect = anchorElement?.getBoundingClientRect();
  const popoverRect = popoverElement?.getBoundingClientRect();
  if (!anchorRect || !popoverRect) {
    return undefined;
  }
  let position: PositionTopLeft = {
    left: anchorRect.left,
    top: anchorRect.top,
  };
  switch (coord.x) {
    case "start":
      position.left -= popoverRect.width;
      break;
    case "center":
      position.left += anchorRect.width / 2 - popoverRect.width / 2;
      break;
    case "end":
      position.left += anchorRect.width;
      break;
  }
  switch (coord.y) {
    case "start":
      position.top -= popoverRect.height;
      break;
    case "center":
      position.top += anchorRect.height / 2 - popoverRect.height / 2;
      break;
    case "end":
      position.top += anchorRect.height;
      break;
  }
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;
  const farBorderX = position.left + popoverRect.width;
  const farBorderY = position.top + popoverRect.height;
  if (position.left < 0) {
    position.left = 0;
  } else if (farBorderX > viewportWidth) {
    position.left -= farBorderX - viewportWidth;
  }
  if (position.top < 0) {
    position.top = 0;
  } else if (farBorderY > viewportHeight) {
    position.top -= farBorderY - viewportHeight;
  }
  if (!stickyParent) {
    const windowScrollX = window ? window.scrollX : 0;
    const windowScrollY = window ? window.scrollY : 0;
    position.left += windowScrollX;
    position.top += windowScrollY;
  }
  return position;
};

export const useAnchorElement = (
  anchorElement: Accessor<Element | undefined>,
  popoverElement: Accessor<Element | undefined>,
  coord: Accessor<PositionCoord>,
  stickyParent?: boolean
) => {
  const calculatePosition = () =>
    CalculateAnchorPoint(
      anchorElement(),
      popoverElement(),
      coord(),
      stickyParent
    );
  const [position, setPosition] = createSignal<PositionTopLeft | undefined>(
    undefined
  );
  createEffect(() => {
    setPosition(calculatePosition());
  });
  if (!isServer) {
    document.addEventListener("scroll", () => {
      setPosition(calculatePosition());
    });
    window.addEventListener("resize", () => {
      setPosition(calculatePosition());
    });
  }
  return position;
};
