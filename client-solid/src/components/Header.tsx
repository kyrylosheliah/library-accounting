import "./Breadcrumbs.css";
import "./Header.css";
import { useLocation } from "@solidjs/router";
import {
  Component,
  For,
  Match,
  Show,
  Switch,
  createEffect,
  createSignal,
  on,
} from "solid-js";
import { useAuth } from "~/hooks/useAuth";
import { IconButton } from "~/ui/components/IconButton";
import { useDisclosure } from "~/ui/hooks/useDisclosure";
import { Breadcrumbs } from "./Breadcrumbs";
import { Popover } from "~/ui/components/Popover";
import { ThemeToggle } from "./ThemeToggle";
import { Modal } from "~/ui/components/Modal";
import { AccountButton } from "./AccountButton";
import { IconBox } from "~/ui/components/IconBox";
import { Text } from "~/ui/components/Text";
import { AnchorButton } from "~/ui/components/AnchorButton";
import { Card } from "~/ui/components/Card";
import { SectionCard } from "./SectionCard";
import { A } from "solid-start";
import { Anchor } from "~/ui/components/Anchor";

type navDisclosure = {
  href: string;
  icon: string;
  title: string;
  description: string;
};

type navItem = {
  href: string;
  title: string;
  claim: string | undefined;
  disclosure: navDisclosure[] | undefined;
};

export const navList: navItem[] = [
  { href: "/", title: "Головна", claim: undefined, disclosure: undefined },
  {
    href: "/library",
    title: "Бібліотека",
    claim: undefined,
    disclosure: undefined,
  },
  {
    href: "/accounting",
    title: "Облік",
    claim: "librarian",
    disclosure: [
      {
        href: "/accounting/bookcategory",
        icon: "i-tabler-category-2",
        title: "Категорія книги",
        description:
          "Список категорій друку для каталогізації та подальшого пошуку",
      },
      {
        href: "/accounting/book",
        icon: "i-tabler-clipboard-text",
        title: "Книга",
        description:
          "Список описів видань та створення згадки про них у системі",
      },
      {
        href: "/accounting/borrow",
        icon: "i-tabler-receipt",
        title: "Запозичення",
        description: "Реєстрація запозичення кошику з друком",
      },
      {
        href: "/accounting/return",
        icon: "i-tabler-receipt-refund",
        title: "Повернення",
        description: "Реєстрація повернення кошику з друком",
      },
      {
        href: "/accounting/supplier",
        icon: "i-tabler-user-down",
        title: "Постачальник",
        description: "Список постачальників та джерел надходження фонду",
      },
      {
        href: "/accounting/supply",
        icon: "i-tabler-square-rounded-plus",
        title: "Постачання",
        description: "Реєстрація надходження до фонду постачання з матеріалом",
      },
    ],
  },
  {
    href: "/management",
    title: "Управління",
    claim: "admin",
    disclosure: [
      {
        href: "/management/user",
        icon: "i-tabler-user-edit",
        title: "Користувач",
        description: "Управляйте користувацькими записами або блокуйте їх",
      },
      {
        href: "/management/role",
        icon: "i-tabler-certificate",
        title: "Роль",
        description: "Управляйте списком ролей серед усіх користувачів",
      },
      {
        href: "/management/event",
        icon: "i-tabler-speakerphone",
        title: "Посадова подія",
        description: "Управляйте маркерами стану посадовця",
      },
      {
        href: "/management/enrollment",
        icon: "i-tabler-address-book",
        title: "Зарахування",
        description: "Управляйте подіями зарахування на посаду",
      },
    ],
  },
  {
    href: "/about",
    title: "Про нас",
    claim: undefined,
    disclosure: undefined,
  },
];

interface MobileListProps {
  href: string;
  title: string;
  disclosure: navDisclosure[];
  ifActiveButton: (path: string) => "light" | undefined;
  ifActiveIcon: (path: string) => "subtle" | undefined;
}

const MobileList: Component<MobileListProps> = (props) => {
  const [opened, setOpened] = createSignal(false);
  return (
    <>
      <div class="flex flex-row items-center justify-stretch gap-5">
        <IconButton
          icon="i-tabler-chevron-down"
          size="lg"
          attributes={{
            onClick: () => setOpened((prev) => !prev),
          }}
        />
        <AnchorButton
          variant={props.ifActiveButton(props.href)}
          class="w-full"
          size="xl"
          href={props.href}
        >
          {props.title}
        </AnchorButton>
      </div>
      <Show when={opened()}>
        <For each={props.disclosure}>
          {(subItem) => (
            <AnchorButton
              variant={props.ifActiveButton(subItem.href)}
              class="w-full flex flex-row gap-4 items-center"
              size="xl"
              href={subItem.href}
            >
              <IconBox
                unpadded
                variant={props.ifActiveIcon(subItem.href)}
                icon={subItem.icon}
                size="xs"
              />
              {subItem.title}
            </AnchorButton>
          )}
        </For>
      </Show>
    </>
  );
};

export function Header() {
  const { hasClaim } = useAuth();
  const location = useLocation();
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [activePath, setActivePath] = createSignal(location.pathname);
  const ifActiveButton = (path: string) =>
    activePath() === path ? "light" : undefined;
  const ifActiveIcon = (path: string) =>
    activePath() === path ? "subtle" : undefined;

  createEffect(
    on(
      () => location.pathname,
      () => {
        setActivePath(location.pathname);
        closeDrawer();
      }
    )
  );

  return (
    <>
      <div class="header flex flex-row justify-between items-center">
        <Breadcrumbs class="h-full basis-0 grow flex flex-row" />
        <div class="h-full hidden lg:flex flex-row">
          <For each={navList}>
            {(navItem) => (
              <Show when={hasClaim(navItem.claim)}>
                <Show
                  when={navItem.disclosure}
                  fallback={
                    <AnchorButton
                      unrounded
                      class="px-3 breadcrumb"
                      href={navItem.href}
                      children={navItem.title}
                    />
                  }
                >
                  <Popover
                    class="h-full"
                    targetWrapperClass="h-full"
                    coord={() => ({ x: "center", y: "end" })}
                    hover
                    stickyParent
                    target={
                      <AnchorButton
                        unrounded
                        unpadded
                        class="px-3 breadcrumb"
                        href={navItem.href}
                      >
                        {navItem.title}
                        <IconBox
                          unrounded
                          unpadded
                          variant="subtle"
                          size="xs"
                          icon="i-tabler-chevron-down"
                          class="ml-2"
                        />
                      </AnchorButton>
                    }
                    popover={
                      <Card class="w-160 mt-1 p-4 grid grid-cols-2 gap-4">
                        <For each={navItem.disclosure}>
                          {(navSubitem) => (
                            <AnchorButton
                              unpadded
                              class="p-2 flex flex-row"
                              size="md"
                              href={navSubitem.href}
                            >
                              <IconBox
                                variant="light"
                                class="mr-2 shrink-0"
                                icon={navSubitem.icon}
                                size="md"
                              />
                              <div>
                                {navSubitem.title}
                                <Text class="text-sm" variant="dim">
                                  {navSubitem.description}
                                </Text>
                              </div>
                            </AnchorButton>
                          )}
                        </For>
                      </Card>
                    }
                  />
                </Show>
              </Show>
            )}
          </For>
        </div>
        <div class="pr-5 basis-0 grow flex flex-row justify-end gap-5">
          <AccountButton />
          <ThemeToggle />
          <IconButton
            class="lg:hidden"
            icon="i-tabler-menu-2"
            size="md"
            attributes={{
              onClick: () => openDrawer(),
            }}
          />
        </div>
      </div>

      <Modal
        opened={drawerOpened}
        class="h-full p-5 lg:hidden backdrop-blur-sm bg-transparent"
      >
        <SectionCard
          class="h-full"
          header={
            <div class="p-3 flex flex-row items-center justify-between">
              <div>
                <IconBox
                  variant="subtle"
                  class="grow-x basis-0"
                  icon="i-tabler-menu-2"
                  size="md"
                />
              </div>
              <Text class="text-xl">Меню</Text>
              <div>
                <IconButton
                  class="grow-x basis-0"
                  icon="i-tabler-x"
                  size="md"
                  attributes={{ onClick: () => closeDrawer() }}
                />
              </div>
            </div>
          }
        >
          <div class="p-3 flex flex-col items-stretch gap-3 overflow-y-auto">
            <For each={navList}>
              {(navItem) => (
                <Show when={hasClaim(navItem.claim)}>
                  <Switch>
                    <Match when={navItem.disclosure}>
                      <MobileList
                        disclosure={navItem.disclosure!}
                        href={navItem.href}
                        title={navItem.title}
                        ifActiveButton={ifActiveButton}
                        ifActiveIcon={ifActiveIcon}
                      />
                    </Match>
                    <Match when={!navItem.disclosure}>
                      <AnchorButton
                        variant={ifActiveButton(navItem.href)}
                        size="xl"
                        href={navItem.href}
                      >
                        {navItem.title}
                      </AnchorButton>
                    </Match>
                  </Switch>
                </Show>
              )}
            </For>
          </div>
        </SectionCard>
      </Modal>
    </>
  );
}
