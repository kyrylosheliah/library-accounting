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
import { SupplyMetadata } from "root/models/Supply";
import Link from "next/link";
import { IconChevronLeft, IconSquareRoundedPlus } from "@tabler/icons-react";
import { useState } from "react";
import { SupplyItemMetadata } from "root/models/SupplyItem";
import { useSupplyAccounting } from "root/hooks/useAccounting";

export default function SupplyAccounting() {
  const theme = useMantineTheme();
  const [selected, setSelected] = useState<number | undefined>(undefined);
  const postShelfSupply = useSupplyAccounting();
  return (
    <>
      <Head>
        <title>Постачання</title>
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
                  <IconSquareRoundedPlus color={theme.fn.primaryColor()} />
                </ThemeIcon>
                &nbsp;&nbsp;Постачання
              </Title>
              <Text>
                Реєстрація надходження до фонду постачання з матеріалом
              </Text>
            </Stack>
          </Grid.Col>
          <Grid.Col lg={6} span={12}>
            <EntityTable
              metadata={SupplyMetadata}
              untitled={false}
              controlled={undefined}
              singular={{ val: selected, set: setSelected, mod: false }}
              crudEnabled={true}
            />
          </Grid.Col>
          <Grid.Col lg={6} span={12}>
            <Stack>
              <EntityTable
                metadata={SupplyItemMetadata}
                untitled={false}
                controlled={[{ column: "SupplyId", value: selected }]}
                singular={undefined}
                crudEnabled={true}
              />
              <Button
                disabled={!selected}
                variant="light"
                onClick={() => selected && postShelfSupply(selected)}
              >
                Прорахувати полиці
              </Button>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}