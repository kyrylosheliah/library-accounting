import {
  Accessor,
  JSX,
  createEffect,
  createSignal,
  on,
  onMount,
} from "solid-js";
import { useLocation } from "solid-start";
import { IconBox } from "~/ui/components/IconBox";

interface Path {
  href: string;
  title: JSX.Element;
}

export const useBreadcrumbs = (): Accessor<Path[]> => {
  const location = useLocation();
  const home = [
    { href: "/", title: <IconBox icon="i-tabler-home-2" size="xs" /> },
  ];
  const update = () => {
    const pathWithoutQuery = location.pathname.split("?")[0];
    const pathArray = pathWithoutQuery.split("/").filter((path) => path !== "");
    const breadcrumbs = home.concat(
      pathArray.map((path, index) => ({
        href: "/" + pathArray.slice(0, index + 1).join("/"),
        title: path.charAt(0).toUpperCase() + path.slice(1),
      }))
    );
    return breadcrumbs;
  };
  const [prev, setPrev] = createSignal(location.pathname);
  const [breadcrumbs, setBreadcrumbs] = createSignal<Path[]>(update());
  createEffect(
    on(
      () => location.pathname,
      () => {
        if (prev() !== location.pathname) {
          setBreadcrumbs(update());
          setPrev(location.pathname);
        }
      }
    )
  );
  return breadcrumbs;
};
