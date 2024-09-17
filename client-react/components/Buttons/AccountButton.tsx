import {
  Group,
  Text,
  Avatar,
  useMantineTheme,
  ActionIcon,
  createStyles,
  Popover,
  Divider,
  rem,
  UnstyledButton,
  Box,
  Center,
  ThemeIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconLogout,
  IconStar,
  IconSettings,
  IconSwitchHorizontal,
  IconUserCog,
  IconLogin,
  IconHourglassHigh,
} from "@tabler/icons-react";
import Link from "next/link";
import { useAuth } from "root/hooks/useAuth";

const useStyles = createStyles((theme) => ({
  dropdown: {
    padding: 0,
    border: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[4]
    }`,
  },
  link: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    width: "100%",
    padding: rem(3),
  },
  linkIcon: {
    marginRight: rem(12),
  },
  linkText: {
    fontSize: rem(14),
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },
  linkButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: rem(8),
    padding: rem(7),
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[0],
    },
  },
}));

const links = [
  {
    href: "/user/wishlist",
    icon: IconStar,
    color: "yellow",
    title: "Список бажаного",
  },
  {
    href: "/user/debt",
    icon: IconHourglassHigh,
    color: "red",
    title: "Борг по запозиченнях",
  },
  {
    href: "/user/borrows",
    icon: IconHourglassHigh,
    color: "blue",
    title: "Усі запозичення та повернення",
  },
  {
    href: "/login",
    icon: IconSwitchHorizontal,
    color: "blue",
    title: "Змінити обліковий запис",
  },
];

export const AccountButton = () => {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const [opened, { close, open }] = useDisclosure(false);
  const { user, logout } = useAuth();

  const togglePopover = () => {
    if (opened) close();
    else open();
  };

  const items = links.map((item, index) => (
    <Link key={index} href={item.href} className={classes.link}>
      <UnstyledButton
        className={classes.linkButton}
        variant="subtle"
        onClick={close}
      >
        <item.icon
          size="1rem"
          className={classes.linkIcon}
          color={theme.colors[item.color][6]}
        />
        <Text className={classes.linkText}>{item.title}</Text>
      </UnstyledButton>
    </Link>
  ));

  return (
    <Group position="center">
      {user ? (
        <Popover opened={opened} width={300}>
          <Popover.Target>
            <ActionIcon
              size="2.375rem"
              variant="outline"
              color={user ? theme.fn.primaryColor() : undefined}
              title={user ? user.record.Name : "Log in"}
              onClick={togglePopover}
            >
              <IconUserCog />
            </ActionIcon>
          </Popover.Target>

          <Popover.Dropdown className={classes.dropdown}>
            <Link href="/user" className={classes.link}>
              <UnstyledButton
                className={classes.linkButton}
                variant="subtle"
                onClick={close}
              >
                <Center>
                  {user.avatar && (
                    <Avatar
                      radius="xl"
                      className={classes.linkIcon}
                      src={`data:${user.avatar.ContentType};base64,${user.avatar.FileContents}`}
                    />
                  )}
                  <div className={classes.linkText}>
                    <Text>{user.record.Name}</Text>
                    <Text size="xs">{user.record.Email}</Text>
                  </div>
                </Center>
                <ThemeIcon variant="light" ml="auto">
                  <IconSettings size="1rem" />
                </ThemeIcon>
              </UnstyledButton>
            </Link>

            <Divider />

            {items}

            <Divider />

            <Box className={classes.link}>
              <UnstyledButton
                onClick={() => {
                  logout();
                  close();
                }}
                className={classes.linkButton}
                variant="subtle"
              >
                <IconLogout size="1rem" className={classes.linkIcon} />
                <Text className={classes.linkText}>Вийти</Text>
              </UnstyledButton>
            </Box>
          </Popover.Dropdown>
        </Popover>
      ) : (
        <Link href="/login">
          <ActionIcon size="2.375rem" variant="default" title="Вхід">
            <IconLogin color={theme.colors["gray"][5]} />
          </ActionIcon>
        </Link>
      )}
    </Group>
  );
};
