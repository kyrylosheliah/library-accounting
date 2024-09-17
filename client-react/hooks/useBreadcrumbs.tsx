import { Text } from "@mantine/core";
import { IconHome2 } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Path {
  href: string;
  title: JSX.Element;
}

export const useBreadcrumbs = () => {
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState<Path[]>([
    { href: "/", title: <IconHome2 /> },
  ]);

  useEffect(() => {
    const pathWithoutQuery = router.asPath.split("?")[0];
    let pathArray = pathWithoutQuery.split("/");

    pathArray = pathArray.filter((path) => path !== "");

    let breadcrumbs = pathArray.map((path, index) => {
      const href = "/" + pathArray.slice(0, index + 1).join("/");
      return {
        href,
        title: <Text>{path.charAt(0).toUpperCase() + path.slice(1)}</Text>,
      };
    });
    breadcrumbs.unshift({ href: "/", title: <IconHome2 /> });

    setBreadcrumbs(breadcrumbs);
  }, [router.asPath]);

  return breadcrumbs;
};
