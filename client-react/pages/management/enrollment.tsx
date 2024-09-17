import Head from "next/head";
import {
  Button,
  Container,
  Grid,
  ThemeIcon,
  Title,
  Text,
  useMantineTheme,
  Center,
  Stack,
} from "@mantine/core";
import { EntityTable } from "root/components/EntityTable";
import { EnrollmentMetadata } from "root/models/Enrollment";
import { UserMetadata } from "root/models/User";
import Link from "next/link";
import { IconAddressBook, IconChevronLeft } from "@tabler/icons-react";
import { useState } from "react";

export default function EnrollmentManagement() {
  const theme = useMantineTheme();
  const [selected, setSelected] = useState<number | undefined>(undefined);
  return (
    <>
      <Head>
        <title>Зарахування</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container size="xl" my="xl" p={0}>
        <Grid>
          <Grid.Col span={12}>
            <Center>
              <Link href="/management">
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
                  <IconAddressBook color={theme.fn.primaryColor()} />
                </ThemeIcon>
                &nbsp;&nbsp;Зарахування
              </Title>
              <Text>Управляйте подіями зарахування на посаду</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col lg={6} span={12}>
            <EntityTable
              metadata={UserMetadata}
              untitled={false}
              controlled={undefined}
              singular={{ val: selected, set: setSelected, mod: false }}
              crudEnabled={true}
            />
          </Grid.Col>
          <Grid.Col lg={6} span={12}>
            <EntityTable
              metadata={EnrollmentMetadata}
              untitled={false}
              controlled={[{ column: "StaffId", value: selected }]}
              singular={undefined}
              crudEnabled={true}
            />
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
