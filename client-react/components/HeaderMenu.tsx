import {
  createStyles,
  Header,
  HoverCard,
  Group,
  Button,
  Text,
  SimpleGrid,
  ThemeIcon,
  Center,
  Box,
  Drawer,
  rem,
  ActionIcon,
  Divider,
  Collapse,
  Flex,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronDown,
  IconMenu2,
  IconLogout,
  IconUserEdit,
  IconCertificate,
  IconSpeakerphone,
  IconCategory2,
  IconAddressBook,
  IconReceipt,
  IconReceiptRefund,
  IconUserDown,
  IconSquareRoundedPlus,
  IconClipboardText,
} from "@tabler/icons-react";
import { useAuth } from "root/hooks/useAuth";
import { AccountButton } from "./Buttons/AccountButton";
import { ThemeToggleButton } from "./Buttons/ThemeToggleButton";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BreadcrumbsButtons } from "./Buttons/BreadcrumbsButtons";

const useStyles = createStyles((theme) => ({
  header: {
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[4]
    }`,
  },

  link: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,

    [theme.fn.smallerThan("md")]: {
      fontSize: theme.fontSizes.xl,
      height: rem(60),
      width: "100%",
      margin: rem(10),
    },

    ...theme.fn.hover({
      transition: "500ms ease",
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    }),
  },

  subLink: {
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.radius.md,
    ...theme.fn.hover({
      transition: "500ms ease",
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
    }),
  },

  dropdown: {
    overflow: "hidden",
    border: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[4]
    }`,
  },

  dropdownFooter: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    margin: `calc(${theme.spacing.md} * -1)`,
    marginTop: theme.spacing.sm,
    padding: `${theme.spacing.md} calc(${theme.spacing.md} * 2)`,
    paddingBottom: theme.spacing.xl,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[4]
    }`,
  },

  hiddenMobile: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },

  linkIcon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));

const accountingTab = [
  {
    link: "/accounting/bookcategory",
    icon: IconCategory2,
    title: "Категорія книги",
    description:
      "Список категорій друку для каталогізації та подальшого пошуку",
  },
  {
    link: "/accounting/book",
    icon: IconClipboardText,
    title: "Книга",
    description: "Список описів видань та створення згадки про них у системі",
  },
  {
    link: "/accounting/borrow",
    icon: IconReceipt,
    title: "Запозичення",
    description: "Реєстрація запозичення кошику з друком",
  },
  {
    link: "/accounting/return",
    icon: IconReceiptRefund,
    title: "Повернення",
    description: "Реєстрація повернення кошику з друком",
  },
  {
    link: "/accounting/supplier",
    icon: IconUserDown,
    title: "Постачальник",
    description: "Список постачальників та джерел надходження фонду",
  },
  {
    link: "/accounting/supply",
    icon: IconSquareRoundedPlus,
    title: "Постачання",
    description: "Реєстрація надходження до фонду постачання з матеріалом",
  },
];
const managementTab = [
  {
    link: "/management/user",
    icon: IconUserEdit,
    title: "Користувач",
    description: "Управляйте користувацькими записами або блокуйте їх",
  },
  {
    link: "/management/role",
    icon: IconCertificate,
    title: "Роль",
    description: "Управляйте списком ролей серед усіх користувачів",
  },
  {
    link: "/management/event",
    icon: IconSpeakerphone,
    title: "Посадова подія",
    description: "Управляйте маркерами стану посадовця",
  },
  {
    link: "/management/enrollment",
    icon: IconAddressBook,
    title: "Зарахування",
    description: "Управляйте подіями зарахування на посаду",
  },
];

export function HeaderMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [accountingOpened, { toggle: toggleAccounting }] = useDisclosure(false);
  const [managementOpened, { toggle: toggleManagement }] = useDisclosure(false);
  const { classes, theme, cx } = useStyles();
  const { user, hasClaim, logout } = useAuth();
  const router = useRouter();
  const [active, setActive] = useState(router.asPath);

  useEffect(() => {
    setActive(router.asPath);
    closeDrawer();
  }, [router.asPath]);

  return (
    <Box>
      <Header height={86} px="md" className={classes.header}>
        <Group position="apart" h="100%" w="100%" noWrap>
          <Group noWrap spacing="xs">
            <ActionIcon
              color="black"
              size="2.375rem"
              onClick={toggleDrawer}
              className={classes.hiddenDesktop}
            >
              <IconMenu2 />
            </ActionIcon>
            <BreadcrumbsButtons />
          </Group>
          <Group h="100%" spacing={0} className={classes.hiddenMobile}>
            <Link href="/" className={classes.link}>
              Головна
            </Link>
            <Link href="/library" className={classes.link}>
              Бібліотека
            </Link>
            {(user ? hasClaim("librarian") : false) && (
              <HoverCard width={600} position="bottom">
                <HoverCard.Target>
                  <Link href="/accounting" className={classes.link}>
                    <Center inline>
                      <Box component="span" mr={5}>
                        Облік
                      </Box>
                      <IconChevronDown
                        size={16}
                        color={theme.fn.primaryColor()}
                      />
                    </Center>
                  </Link>
                </HoverCard.Target>

                <HoverCard.Dropdown className={classes.dropdown}>
                  <SimpleGrid cols={2} spacing={0}>
                    {accountingTab.map((item) => (
                      <Link
                        className={classes.subLink}
                        key={item.title}
                        href={item.link}
                      >
                        <Group noWrap align="flex-start">
                          <ThemeIcon size={34} variant="default" radius="md">
                            <item.icon
                              size={rem(22)}
                              color={theme.fn.primaryColor()}
                            />
                          </ThemeIcon>
                          <div>
                            <Text size="sm" fw={500}>
                              {item.title}
                            </Text>
                            <Text size="xs" color="dimmed">
                              {item.description}
                            </Text>
                          </div>
                        </Group>
                      </Link>
                    ))}
                  </SimpleGrid>

                  <div className={classes.dropdownFooter}>
                    <Group position="apart">
                      <div>
                        <Text fw={500} fz="sm">
                          Екран обліку
                        </Text>
                        <Text size="xs" color="dimmed">
                          Навігація діями щодо обліку
                        </Text>
                      </div>
                      <Link href="/accounting">
                        <Button variant="default">Перейти</Button>
                      </Link>
                    </Group>
                  </div>
                </HoverCard.Dropdown>
              </HoverCard>
            )}

            {(user ? hasClaim("librarian") : false) && (
              <HoverCard width={600} position="bottom">
                <HoverCard.Target>
                  <Link href="/management" className={classes.link}>
                    <Center inline>
                      <Box component="span" mr={5}>
                        Управління
                      </Box>
                      <IconChevronDown
                        size={16}
                        color={theme.fn.primaryColor()}
                      />
                    </Center>
                  </Link>
                </HoverCard.Target>

                <HoverCard.Dropdown className={classes.dropdown}>
                  <SimpleGrid cols={2} spacing={0}>
                    {managementTab.map((item) => (
                      <Link
                        className={classes.subLink}
                        key={item.title}
                        href={item.link}
                      >
                        <Group noWrap align="flex-start">
                          <ThemeIcon size={34} variant="default" radius="md">
                            <item.icon
                              size={rem(22)}
                              color={theme.fn.primaryColor()}
                            />
                          </ThemeIcon>
                          <div>
                            <Text size="sm" fw={500}>
                              {item.title}
                            </Text>
                            <Text size="xs" color="dimmed">
                              {item.description}
                            </Text>
                          </div>
                        </Group>
                      </Link>
                    ))}
                  </SimpleGrid>

                  <div className={classes.dropdownFooter}>
                    <Group position="apart">
                      <div>
                        <Text fw={500} fz="sm">
                          Екран управління
                        </Text>
                        <Text size="xs" color="dimmed">
                          Навігація діями щодо користувачів
                        </Text>
                      </div>
                      <Link href="/management">
                        <Button variant="default">Перейти</Button>
                      </Link>
                    </Group>
                  </div>
                </HoverCard.Dropdown>
              </HoverCard>
            )}
            <Link href="/about" className={classes.link}>
              Про нас
            </Link>
          </Group>

          <Group spacing="xs">
            <ThemeToggleButton />
            <AccountButton />
          </Group>
        </Group>
      </Header>

      <Drawer
        closeButtonProps={{ size: "2.375rem", color: "black" }}
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="xl"
        title={
          <Group>
            <Center>
              <IconMenu2 />
            </Center>
            <Text size="xl">Меню</Text>
          </Group>
        }
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <Divider
          mb="sm"
          color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
        />

        {user ? (
          <Group position="center" grow mx="xl">
            <Text weight={600} size="lg" color="dimmed" ta="center">
              {user.record.Email}
            </Text>
            <Button size="lg" variant="default" onClick={() => logout()}>
              <IconLogout className={classes.linkIcon} />
              <span>Вийти</span>
            </Button>
          </Group>
        ) : (
          <Group position="center" grow px="md">
            <Link href="/login">
              <Button variant="default" onClick={() => {}}>
                Увійти
              </Button>
            </Link>
            <Link href="/register">
              <Button onClick={() => {}}>Зареєструватися</Button>
            </Link>
          </Group>
        )}

        <Divider
          my="sm"
          color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
        />

        <Link style={{ width: "100%" }} href="/">
          <Button
            variant="subtle"
            className={cx(classes.link, {
              [classes.linkActive]: active == "/",
            })}
          >
            Головна
          </Button>
        </Link>
        <Link style={{ width: "100%" }} href="/library">
          <Button
            variant="subtle"
            className={cx(classes.link, {
              [classes.linkActive]: active.startsWith("/library"),
            })}
          >
            Бібліотека
          </Button>
        </Link>
        {(user ? hasClaim("librarian") : false) && (
          <div>
            <Flex direction="row">
              <ActionIcon
                onClick={toggleAccounting}
                size={rem(60)}
                m={rem(10)}
                variant="subtle"
                color="black"
              >
                <IconChevronDown />
              </ActionIcon>
              <Link style={{ width: "100%" }} href="/accounting">
                <Button
                  variant="subtle"
                  className={cx(classes.link, {
                    [classes.linkActive]: active.startsWith("/accounting"),
                  })}
                >
                  Облік
                </Button>
              </Link>
            </Flex>
            <Collapse in={accountingOpened}>
              {accountingTab.map((item) => (
                <Link
                  style={{ width: "100%" }}
                  href={item.link}
                  key={item.title}
                >
                  <Button
                    variant="subtle"
                    className={cx(classes.link, {
                      [classes.linkActive]: active.startsWith(item.link),
                    })}
                  >
                    <item.icon className={classes.linkIcon} stroke={1.5} />
                    <span>{item.title}</span>
                  </Button>
                </Link>
              ))}
            </Collapse>
          </div>
        )}
        {(user ? hasClaim("admin") : false) && (
          <div>
            <Flex direction="row">
              <ActionIcon
                onClick={toggleManagement}
                size={rem(60)}
                m={rem(10)}
                variant="subtle"
                color="black"
              >
                <IconChevronDown />
              </ActionIcon>
              <Link style={{ width: "100%" }} href="/management">
                <Button
                  variant="subtle"
                  className={cx(classes.link, {
                    [classes.linkActive]: active.startsWith("/management"),
                  })}
                >
                  Управління
                </Button>
              </Link>
            </Flex>
            <Collapse in={managementOpened}>
              {managementTab.map((item) => (
                <Link
                  style={{ width: "100%" }}
                  href={item.link}
                  key={item.title}
                >
                  <Button
                    variant="subtle"
                    className={cx(classes.link, {
                      [classes.linkActive]: active.startsWith(item.link),
                    })}
                  >
                    <item.icon className={classes.linkIcon} stroke={1.5} />
                    <span>{item.title}</span>
                  </Button>
                </Link>
              ))}
            </Collapse>
          </div>
        )}
        <Link style={{ width: "100%" }} href="/about">
          <Button
            variant="subtle"
            className={cx(classes.link, {
              [classes.linkActive]: active.startsWith("/about"),
            })}
          >
            Про нас
          </Button>
        </Link>
      </Drawer>
    </Box>
  );
}
