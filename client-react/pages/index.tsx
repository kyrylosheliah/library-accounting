import Head from "next/head";

import {
  createStyles,
  Title,
  Text,
  Button,
  Container,
  rem,
  Card,
  SimpleGrid,
  Blockquote,
} from "@mantine/core";
import {
  IconGauge,
  IconCookie,
  IconSearch,
  IconUsersGroup,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    marginTop: rem(120),

    [theme.fn.smallerThan("sm")]: {
      paddingTop: rem(80),
      paddingBottom: rem(60),
    },
  },

  inner: {
    position: "relative",
    zIndex: 1,
  },

  title: {
    textAlign: "center",
    fontWeight: 800,
    fontSize: rem(40),
    letterSpacing: -1,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(28),
      textAlign: "left",
    },
  },

  highlight: {
    color:
      theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6],
  },

  description: {
    textAlign: "center",

    [theme.fn.smallerThan("xs")]: {
      textAlign: "left",
      fontSize: theme.fontSizes.md,
    },
  },

  controls: {
    marginTop: theme.spacing.lg,
    display: "flex",
    justifyContent: "center",

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },

  control: {
    "&:not(:first-of-type)": {
      marginLeft: theme.spacing.md,
    },

    [theme.fn.smallerThan("xs")]: {
      height: rem(42),
      fontSize: theme.fontSizes.md,

      "&:not(:first-of-type)": {
        marginTop: theme.spacing.md,
        marginLeft: 0,
      },
    },
  },

  card: {
    border: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[4]
    }`,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : "white",
  },

  cardTitle: {
    "&::after": {
      content: '""',
      display: "block",
      backgroundColor: theme.fn.primaryColor(),
      width: rem(45),
      height: rem(2),
      marginTop: theme.spacing.sm,
    },
  },
}));

const featureData = [
  {
    title: "Ми маємо щось і для вас",
    description:
      "Знання - сила! Ми раді, що ви знайшли час, щоб завітати до нашого каталогу. Ми пропонуємо широкий вибір друкованих видань незалежно від вашого інтересу чи віку, у нас є щось для кожного. Долучайтеся!",
    icon: IconCookie,
  },
  {
    title: "Читання - це могутність",
    description:
      "Робота з джерелами та усвідомлення добре викладених думок інших людей є незамінним чинником вищої діяльності людини. Дослідження: люди, які багато читають, мають словниковий запас на 20% більше, а також набувають когнітивних навичок: логічне мислення, концентрація, пам'ять і творчість, оскільки воно збільшує кількість з'єднань між нейронами в головному мозку.",
    icon: IconGauge,
  },
  {
    title: "Спільнота любителів читання",
    description:
      "Наша бібліотека - це не просто одна велитенська кнжкова полиця. Ми пропонуємо затишні кутки для читання, зручні робочі місця та навіть регулярні заходи, такі як авторські читання і книжкові клуби. Розширюйте свої горизонти приєднавшись до нашої бібліотеки!",
    icon: IconUsersGroup,
  },
];

export default function Home() {
  const router = useRouter();
  const { classes, theme } = useStyles();
  const features = featureData.map((feature) => (
    <Card key={feature.title} shadow="md" className={classes.card} padding="xl">
      <feature.icon size={rem(50)} stroke={2} color={theme.fn.primaryColor()} />
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" c="dimmed" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ));

  return (
    <>
      <Head>
        <title>Головна</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container className={classes.wrapper} size="lg">
        <div className={classes.inner}>
          <Title className={classes.title}>
            Каталог:{" "}
            <Text component="span" className={classes.highlight}>
              друк так книжки
            </Text>{" "}
            для всіх
          </Title>

          <Container p={0} size={600}>
            <Text size="lg" color="dimmed" className={classes.description}>
              Шукайте книжки та друковані видання. <br />
              Знаходьте своє наступне натхнення. <br />
              Чекаємо на вас.
            </Text>
          </Container>

          <div className={classes.controls}>
            <Link href="/about" className={classes.control}>
              <Button size="lg" variant="default">
                Питання?
              </Button>
            </Link>
            <Link href="/library" className={classes.control}>
              <Button size="lg">
                <IconSearch /> &nbsp; До пошуку
              </Button>
            </Link>
          </div>
        </div>
      </Container>

      <Container size="lg" mt={100}>
        <SimpleGrid
          cols={3}
          spacing="xl"
          breakpoints={[{ maxWidth: "md", cols: 1 }]}
        >
          {features}
        </SimpleGrid>
      </Container>

      <Container size="sm">
        <Blockquote cite="— Тома Аквінський" mt={100}>
          Нехай думки, укладені в книгах, будуть твоїм основним капіталом, а
          думки, які виникнуть у тебе самого – відсотками з нього
        </Blockquote>
      </Container>
    </>
  );
}
