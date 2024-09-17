import Head from "next/head";
import {
  createStyles,
  Container,
  rem,
  Paper,
  Text,
  useMantineTheme,
  Title,
  Stack,
  ThemeIcon,
  Button,
  Center,
  Group,
  SimpleGrid,
  Flex,
} from "@mantine/core";
import Link from "next/link";
import { IconChevronLeft, IconStar, IconStarFilled } from "@tabler/icons-react";
import { useWishlist } from "root/hooks/useWishlist";
import { LabeledField } from "root/components/LabeledField";
import { LoadingListWrapper } from "root/components/LoadingWrapper";
import { LibrarySearchItem } from "root/components/Buttons/LibrarySearchItem";

const useStyles = createStyles((theme) => ({
  block: {
    border: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[4]
    }`,
  },

  padded: {
    padding: rem(24),
  },
}));

export default function UserWishlist() {
  const theme = useMantineTheme();
  const { classes, cx } = useStyles();
  const { ready, success, wishlist, unwish } = useWishlist();

  const items = wishlist.map((wish, index) => (
    <div key={index}>
      <Flex
        direction="row"
        justify="space-between"
        align="center"
        mt="xl"
        mb="xs"
      >
        <Group>
          <ThemeIcon variant="light" color="yellow" size={rem(36)}>
            <IconStarFilled />
          </ThemeIcon>
          <Text>Додано до обраних (код {wish.Id})</Text>
        </Group>
        <Button variant="subtle" color="red" onClick={() => unwish(index)}>
          Прибрати?
        </Button>
      </Flex>
      <Paper className={cx(classes.block, classes.padded)}>
        {wish.Book ? (
          <SimpleGrid m={0} cols={2}>
            <LibrarySearchItem
              link={`/library/${wish.Book.Id}`}
              author={wish.Book.Author}
              category={
                wish.BookCategory
                  ? wish.BookCategory
                  : `${wish.Book?.CategoryId}`
              }
              title={wish.Book.Title}
              image={`${process.env.BACKEND}/book/${wish.Book.Id}_cover.jpg`}
            />
            <Flex direction="column">
              <LabeledField label="Назва" value={wish.Book.Title} />
              {wish.BookCategory ? (
                <LabeledField label="Категорія" value={wish.BookCategory} />
              ) : (
                <LabeledField
                  label="Код Категорії"
                  value={wish.Book.CategoryId}
                />
              )}
              <LabeledField label="Автор" value={wish.Book.Author} />
              <LabeledField
                label="ISBN"
                description="(універсальний ідентифікаційний номер)"
                value={wish.Book.Isbn}
              />
              <LabeledField label="Рік видання" value={wish.Book.Year} />
            </Flex>
          </SimpleGrid>
        ) : (
          "Невідома книга"
        )}
      </Paper>
    </div>
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
        <Center mb="xl">
          <Link href="/user">
            <Button variant="subtle" pl="xs" pr="lg">
              <IconChevronLeft />
              Назад
            </Button>
          </Link>
        </Center>
        <Stack align="center">
          <Title align="center">
            <ThemeIcon size={34} variant="default" radius="md">
              <IconStar color={theme.colors["yellow"][6]} />
            </ThemeIcon>
            &nbsp;&nbsp;Список бажаного
          </Title>
          <Text>Списки обраних друкованих видань</Text>
        </Stack>
        <LoadingListWrapper success={success} ready={ready} items={items} />
      </Container>
    </>
  );
}