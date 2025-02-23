import Head from "next/head";
import {
  createStyles,
  Container,
  rem,
  Paper,
  SimpleGrid,
  Text,
  useMantineTheme,
  Tabs,
  Title,
  Flex,
  Center,
  Avatar,
  NumberInput,
  Button,
  ThemeIcon,
} from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  IconHourglassHigh,
  IconId,
  IconIdOff,
  IconPencil,
  IconPlayerPlay,
  IconPlayerStop,
  IconReceipt,
  IconStar,
  IconUser,
} from "@tabler/icons-react";
import { useAuth } from "root/hooks/useAuth";
import { LabeledField } from "root/components/LabeledField";
import { UserPasswordForm } from "root/components/UserPasswordForm";
import { UserAvatarForm } from "root/components/UserAvatarForm";
import { UserForm } from "root/components/UserForm";
import { useMembership } from "root/hooks/useMembership";

const useStyles = createStyles((theme) => ({
  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    height: rem(90),
    transition: "box-shadow 150ms ease, transform 100ms ease",

    "&:hover": {
      boxShadow: theme.shadows.xs,
      transform: "scale(1.05)",
    },
  },

  block: {
    border: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[4]
    }`,
  },

  padded: {
    padding: rem(24),
  },

  subTitle: {
    marginTop: rem(30),
    marginBottom: rem(10),
    marginLeft: rem(30),
  },
}));

const links = [
  {
    title: "Список бажаного",
    icon: IconStar,
    color: "yellow",
    href: "/user/wishlist",
  },
  {
    title: "Борг по запозиченнях",
    icon: IconHourglassHigh,
    color: "red",
    href: "/user/debt",
  },
  {
    title: "Запозичення та Повернення",
    icon: IconReceipt,
    color: "blue",
    href: "/user/borrows",
  },
];

export default function User() {
  const theme = useMantineTheme();
  const { classes, cx } = useStyles();

  const { user, assignUser } = useAuth();

  const { membership, submit } = useMembership();
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    assignUser();
  }, []);

  const linkItems = links.map((item, index) => (
    <Link key={index} href={item.href}>
      <Paper className={cx(classes.link, classes.block)}>
        <item.icon color={theme.colors[item.color][6]} size={rem(36)} />
        <Text size="xs" mt={7}>
          {item.title}
        </Text>
      </Paper>
    </Link>
  ));

  return (
    <>
      <Head>
        <title>Обліковий запис</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container size="sm" mt={rem(30)}>
        <Title align="center">Особистий кабінет</Title>

        <SimpleGrid my="xl" cols={3} spacing="xl">
          {linkItems}
        </SimpleGrid>

        <Tabs mt="xl" defaultValue="Профіль">
          <Center>
            <Tabs.List position="center">
              <Tabs.Tab value={"Профіль"} icon={<IconUser />}>
                Профіль
              </Tabs.Tab>
              <Tabs.Tab value={"Змінити дані"} icon={<IconPencil />}>
                Змінити дані
              </Tabs.Tab>
              <Tabs.Tab value={"Членство"} icon={<IconId />}>
                Членство
              </Tabs.Tab>
            </Tabs.List>
          </Center>
          <Tabs.Panel value={"Профіль"}>
            <Title order={2} className={classes.subTitle}>
              Дані користувача
            </Title>
            <Paper className={cx(classes.block, classes.padded)}>
              {user ? (
                <Flex direction="column">
                  <Flex direction="row" wrap="wrap" align="center">
                    <Avatar
                      src={
                        user.avatar &&
                        `data:${user.avatar.ContentType};base64,${user.avatar.FileContents}`
                      }
                      size={120}
                      radius={120}
                      mr="xl"
                    />
                    <Flex direction="column">
                      <LabeledField
                        label="Код"
                        description="(ідентифікатор у системі)"
                        value={user.record.Id}
                      />
                      <LabeledField label="Ім'я" value={user.record.Name} />
                    </Flex>
                  </Flex>
                  <LabeledField label="Email" value={user.record.Email} />
                  <LabeledField
                    label="Номер телефону"
                    value={user.record.Phone || "-?-"}
                  />
                  <LabeledField
                    label="Дата народження"
                    value={
                      user.record.DateOfBirth
                        ? new Date(user.record.DateOfBirth).toLocaleString()
                        : "-?-"
                    }
                  />
                  <LabeledField
                    label="Адреса"
                    value={user.record.Address || "-?-"}
                  />
                  <LabeledField
                    label="Стать"
                    value={user.record.Gender || "-?-"}
                  />
                  <LabeledField
                    label="Дата реєстрації"
                    value={new Date(user.record.RegisterDate).toLocaleString()}
                  />
                </Flex>
              ) : (
                <Flex>
                  <div>Дані про користувача ще не отримані</div>
                </Flex>
              )}
            </Paper>
          </Tabs.Panel>
          <Tabs.Panel value={"Змінити дані"}>
            <Title order={2} className={classes.subTitle}>
              Аватар
            </Title>
            <Paper className={cx(classes.block, classes.padded)}>
              <UserAvatarForm />
            </Paper>
            <Title order={2} className={classes.subTitle}>
              Пароль
            </Title>
            <Paper className={cx(classes.block, classes.padded)}>
              <UserPasswordForm />
            </Paper>
            <Title order={2} className={classes.subTitle}>
              Інші дані
            </Title>
            <Paper className={cx(classes.block, classes.padded)}>
              <UserForm />
            </Paper>
          </Tabs.Panel>
          <Tabs.Panel value={"Членство"}>
            <Title order={2} className={classes.subTitle}>
              Членство
            </Title>
            <Paper className={cx(classes.block, classes.padded)}>
              <Flex direction="column" align="center" gap="xl">
                <LabeledField
                  label="Статус"
                  value={membership ? "Дійсне" : "Відсутнє"}
                  icon={
                    membership ? (
                      <ThemeIcon variant="light" color="lime">
                        <IconId />
                      </ThemeIcon>
                    ) : (
                      <ThemeIcon variant="light" color="gray">
                        <IconIdOff />
                      </ThemeIcon>
                    )
                  }
                />
                {membership
                  ? [
                      <LabeledField
                        label="Початок"
                        value={membership.StartDate.toLocaleString()}
                        icon={
                          <ThemeIcon variant="default">
                            <IconPlayerPlay />
                          </ThemeIcon>
                        }
                      />,
                      <LabeledField
                        label="Кінець"
                        value={membership.ExpirationDate.toLocaleString()}
                        icon={
                          <ThemeIcon variant="default">
                            <IconPlayerStop />
                          </ThemeIcon>
                        }
                      />,
                    ]
                  : undefined}
              </Flex>
            </Paper>
            <Title order={2} className={classes.subTitle}>
              Оплата
            </Title>
            <Paper className={cx(classes.block, classes.padded)}>
              <Flex w="100%" align="flex-end" gap="xl">
                <NumberInput
                  w="100%"
                  label="Введіть суму"
                  value={amount}
                  onChange={(value) => setAmount(value || 0)}
                  precision={6}
                  min={0}
                  step={0.000001}
                />
                <Button variant="light" onClick={() => submit(amount)}>
                  Сплатити
                </Button>
              </Flex>
            </Paper>
          </Tabs.Panel>
        </Tabs>

        <Paper></Paper>
      </Container>
    </>
  );
}
