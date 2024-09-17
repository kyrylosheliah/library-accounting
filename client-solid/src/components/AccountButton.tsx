import { Component, For, Match, Switch, createEffect, on } from "solid-js";
import { useAuth } from "~/hooks/useAuth";
import { AnchorButton } from "~/ui/components/AnchorButton";
import { Popover } from "~/ui/components/Popover";
import { Text } from "~/ui/components/Text";
import { IconBox } from "~/ui/components/IconBox";
import { Button } from "~/ui/components/Button";
import { AnchorIcon } from "~/ui/components/AnchorIcon";
import { cx } from "~/ui/utils/cx";
import { useDisclosure } from "~/ui/hooks/useDisclosure";
import { IconButton } from "~/ui/components/IconButton";
import { useLocation } from "solid-start";
import { SectionCard } from "./SectionCard";

const links = [
  {
    href: "/user/wishlist",
    icon: "i-tabler-star",
    iconColor: "text-yellow-500",
    title: "Список бажаного",
  },
  {
    href: "/user/debt",
    icon: "i-tabler-hourglass-high",
    iconColor: "text-red-500",
    title: "Борг по запозиченнях",
  },
  {
    href: "/user/borrows",
    icon: "i-tabler-hourglass-high",
    iconColor: "text-blue-500",
    title: "Усі запозичення та повернення",
  },
  {
    href: "/login",
    icon: "i-tabler-switch-horizontal",
    iconColor: "text-blue-500",
    title: "Змінити обліковий запис",
  },
];

export const AccountButton: Component = () => {
  const { user, logout } = useAuth();
  const popoverState = useDisclosure(false);

  const location = useLocation();

  createEffect(
    on(
      () => location.pathname,
      () => popoverState[1].close()
    )
  );

  return (
    <Switch>
      <Match when={user()}>
        <Popover
          stickyParent
          controlled={popoverState}
          coord={() => ({ x: "center", y: "end" })}
          target={
            <IconButton size="md" variant="outline" icon="i-tabler-user-cog" />
          }
          popover={
            <SectionCard
              class="w-72 mt-6 mr-1 gap-1"
              header={
                <AnchorButton
                  unpadded
                  class="grow-x mx-1 mt-1 p-2 flex justify-between items-center"
                  href="/user"
                  size="md"
                >
                  <div class="flex flex-row">
                    {user()!.avatar && (
                      <img
                        class="rounded-full object-cover w-10 h-10"
                        src={`data:${user()!.avatar.ContentType};base64,${
                          user()!.avatar.FileContents
                        }`}
                        alt={user()!.record.Name}
                      />
                    )}
                    <div class="px-2 flex flex-col justify-around">
                      <Text class="text-xs text-left">
                        {user()!.record.Name}
                      </Text>
                      <Text class="text-xs text-left">
                        {user()!.record.Email}
                      </Text>
                    </div>
                  </div>
                  <IconBox variant="light" size="xs" icon="i-tabler-settings" />
                </AnchorButton>
              }
              footer={
                <Button
                  unpadded
                  class="grow-x mx-1 mb-1 p-2 flex items-center"
                  size="sm"
                  attributes={{
                    onClick: () => logout(),
                  }}
                >
                  <IconBox class="mr-2" size="xs" icon="i-tabler-logout" />
                  <Text>Вийти</Text>
                </Button>
              }
            >
              <div class="px-1">
                <For each={links}>
                  {(link) => (
                    <AnchorButton
                      unpadded
                      class="grow-x p-2 flex items-center"
                      href={link.href}
                      size="sm"
                    >
                      <IconBox
                        class={cx(link.iconColor, "mr-2")}
                        variant="unstyle"
                        size="xs"
                        icon={link.icon}
                      />
                      <Text>{link.title}</Text>
                    </AnchorButton>
                  )}
                </For>
              </div>
            </SectionCard>
          }
        />
      </Match>
      <Match when={!user()}>
        <AnchorIcon
          icon="i-tabler-logout"
          size="md"
          href="/login"
          title="Вхід"
        />
      </Match>
    </Switch>
  );
};
