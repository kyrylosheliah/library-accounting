import Head from "next/head";
import { Container, Grid, rem, Title } from "@mantine/core";
import { IconAddressBook } from "@tabler/icons-react";
import { DBEntityButton } from "root/components/Buttons/DBEntityButton";
import { UserMetadata } from "root/models/User";
import { UserClaimMetadata } from "root/models/UserClaim";
import { EnrollmentEventMetadata } from "root/models/EnrollmentEvent";
import { EnrollmentMetadata } from "root/models/Enrollment";

const HEIGHT_1 = rem(100);

export default function Management() {
  return (
    <>
      <Head>
        <title>Управління</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container size="xl" my="xl" p={0}>
        <Grid justify="center">
          <Grid.Col span={12} my="xl">
            <Title order={1} align="center">
              Екран управління
            </Title>
          </Grid.Col>
          <Grid.Col lg={3} sm={6}>
            <DBEntityButton
              Icon={undefined}
              metadata={UserMetadata}
              height={HEIGHT_1}
              link="/management/user"
            />
          </Grid.Col>
          <Grid.Col lg={3} sm={6}>
            <DBEntityButton
              Icon={undefined}
              metadata={UserClaimMetadata}
              height={HEIGHT_1}
              link="/management/role"
            />
          </Grid.Col>
          <Grid.Col lg={3} sm={6}>
            <DBEntityButton
              Icon={undefined}
              metadata={EnrollmentEventMetadata}
              height={HEIGHT_1}
              link="/management/event"
            />
          </Grid.Col>
          <Grid.Col lg={3} sm={6}>
            <DBEntityButton
              Icon={<IconAddressBook size="2.375rem" />}
              metadata={EnrollmentMetadata}
              height={HEIGHT_1}
              link="/management/enrollment"
            />
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
