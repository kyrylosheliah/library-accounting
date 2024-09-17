import { Breadcrumbs } from "@mantine/core";
import Link from "next/link";
import { useBreadcrumbs } from "root/hooks/useBreadcrumbs";

export function BreadcrumbsButtons() {
  const breadcrumbs = useBreadcrumbs();
  return (
    <Breadcrumbs>
      {breadcrumbs.map((item, index) => (
        <Link href={item.href} key={index}>
          {item.title}
        </Link>
      ))}
    </Breadcrumbs>
  );
}
