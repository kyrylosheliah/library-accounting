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
import { EnrollmentEventMetadata } from "root/models/EnrollmentEvent";
import { IconChevronLeft, IconSpeakerphone } from "@tabler/icons-react";
import Link from "next/link";

export default function EnrollmentEventManagement() {
  const theme = useMantineTheme();
  return (
    <>
      <Head>
        <title>Посадова подія</title>
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
                  <IconSpeakerphone color={theme.fn.primaryColor()} />
                </ThemeIcon>
                &nbsp;&nbsp;Посадова подія
              </Title>
              <Text>Управляйте маркерами стану посадовця</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={12}>
            <EntityTable
              metadata={EnrollmentEventMetadata}
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
