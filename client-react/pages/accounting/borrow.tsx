import Head from "next/head";
import {
  Button,
  Container,
  Grid,
  useMantineTheme,
  Text,
  Stack,
  ThemeIcon,
  Title,
  Center,
} from "@mantine/core";
import { EntityTable } from "root/components/EntityTable";
import { BorrowMetadata } from "root/models/Borrow";
import { IconChevronLeft, IconReceipt } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { BorrowItemMetadata } from "root/models/BorrowItem";
import { useBorrowAccounting } from "root/hooks/useAccounting";

export default function BorrowAccounting() {
  const theme = useMantineTheme();
  const [selected, setSelected] = useState<number | undefined>(undefined);
  const postBorrowDebt = useBorrowAccounting();
  return (
    <>
      <Head>
        <title>Запозичення</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container size="xl" my="xl" p={0}>
        <Grid>
          <Grid.Col span={12}>
            <Center>
              <Link href="/accounting">
                <Button variant="subtle" pl="xs" pr="lg">
                  <IconChevronLeft />
                  Назад
                </Button>
              </Link>
            </Center>
          </Grid.Col>
          <Grid.Col span={12}>
            <Stack align="center">
              <Title align="center">
                <ThemeIcon size={34} variant="default" radius="md">
                  <IconReceipt color={theme.fn.primaryColor()} />
                </ThemeIcon>
                &nbsp;&nbsp;Запозичення
              </Title>
              <Text>Реєстрація запозичення кошику з друком</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col lg={6} span={12}>
            <EntityTable
              metadata={BorrowMetadata}
              untitled={false}
              controlled={undefined}
              singular={{ val: selected, set: setSelected, mod: false }}
              crudEnabled={true}
            />
          </Grid.Col>
          <Grid.Col lg={6} span={12}>
            <Stack>
              <EntityTable
                metadata={BorrowItemMetadata}
                untitled={false}
                controlled={[{ column: "BorrowId", value: selected }]}
                singular={undefined}
                crudEnabled={true}
              />
              <Button
                disabled={!selected}
                variant="light"
                onClick={() => selected && postBorrowDebt(selected)}
              >
                Зарахувати борг
              </Button>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}