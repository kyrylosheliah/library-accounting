import {
  createStyles,
  Group,
  ActionIcon,
  rem,
  useMantineColorScheme,
  Text,
  SimpleGrid,
  Box,
} from "@mantine/core";
import {
  IconBrandYoutube,
  IconBrandInstagram,
  IconBook,
  IconBook2,
  IconSun,
  IconPhone,
  IconMapPin,
  IconAt,
  IconBrandTelegram,
} from "@tabler/icons-react";
import Link from "next/link";
import { libraryContacts } from "./LibraryContacts";

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: rem(120),
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[4]
    }`,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : undefined,
  },

  inner: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: `${theme.spacing.md} ${theme.spacing.md}`,

    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column",
    },
  },

  wrapper: {
    display: "flex",
    alignItems: "center",
    color: theme.white,
  },

  title: {
    color: theme.colors[theme.primaryColor][0],
  },

  description: {
    color: theme.white,
  },
  social: {
    flexDirection: "column",
    [theme.fn.smallerThan("sm")]: {
      flexDirection: "row",
    },
  },
}));

const data = [
  {
    title: "Поштова скринька",
    description: libraryContacts.email,
    icon: IconAt,
  },
  { title: "Телефон", description: libraryContacts.phone, icon: IconPhone },
  { title: "Адреса", description: libraryContacts.address, icon: IconMapPin },
  {
    title: "Робочі години",
    description: libraryContacts.workingTime,
    icon: IconSun,
  },
];

export function FooterMenu() {
  const { classes } = useStyles();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const items = data.map((item, index) => (
    <div key={index} className={classes.wrapper}>
      <Box mr="md">
        <item.icon size="1.5rem" />
      </Box>

      <div>
        <Text size="xs" className={classes.title}>
          {item.title}
        </Text>
        <Text className={classes.description}>{item.description}</Text>
      </div>
    </div>
  ));

  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        <Link href="/about">
          <ActionIcon size="2.375rem" variant="default">
            {dark ? <IconBook2 /> : <IconBook />}
          </ActionIcon>
        </Link>

        <Box
          sx={(theme) => ({
            margin: theme.spacing.lg,
            padding: theme.spacing.lg,
            borderRadius: theme.radius.md,
            backgroundImage: `linear-gradient(135deg, ${
              theme.colors[theme.primaryColor][dark ? 9 : 6]
            } 0%, ${theme.colors[theme.primaryColor][dark ? 7 : 4]} 100%)`,
          })}
        >
          <SimpleGrid
            cols={4}
            breakpoints={[
              { maxWidth: 1200, cols: 2 },
              { maxWidth: 576, cols: 1 },
            ]}
          >
            {items}
          </SimpleGrid>
        </Box>

        <Group className={classes.social} spacing="xs" position="right" noWrap>
          <ActionIcon size="2.375rem" variant="default">
            <IconBrandTelegram />
          </ActionIcon>
          <ActionIcon size="2.375rem" variant="default">
            <IconBrandYoutube />
          </ActionIcon>
          <ActionIcon size="2.375rem" variant="default">
            <IconBrandInstagram />
          </ActionIcon>
        </Group>
      </div>
    </div>
  );
}
