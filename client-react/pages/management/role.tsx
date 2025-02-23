import Head from "next/head";
import {
  Button,
  Container,
  Grid,
  Stack,
  ThemeIcon,
  Title,
  Text,
  useMantineTheme,
  Center,
} from "@mantine/core";
import { EntityTable } from "root/components/EntityTable";
import { UserClaimMetadata } from "root/models/UserClaim";
import { IconCertificate, IconChevronLeft } from "@tabler/icons-react";
import Link from "next/link";

export default function RoleManagement() {
  const theme = useMantineTheme();
  return (
    <>
      <Head>
        <title>Облік користувацьких ролей</title>
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
                  <IconCertificate color={theme.fn.primaryColor()} />
                </ThemeIcon>
                &nbsp;&nbsp;Роль
              </Title>
              <Text>Управляйте списком ролей серед усіх користувачів</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={12}>
            <EntityTable
              metadata={UserClaimMetadata}
              untitled={true}
              controlled={undefined}
              singular={undefined}
              crudEnabled={true}
            />
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
