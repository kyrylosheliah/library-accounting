import {
  rem,
  useMantineTheme,
  useMantineColorScheme,
  UnstyledButton,
  Divider,
  Flex,
  Box,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export function DBEntityButton({
  Icon,
  metadata,
  height,
  link,
}: {
  Icon: any | undefined;
  metadata: any | undefined;
  height: string;
  link: string;
}) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const backlit = Icon !== undefined;
  const whiteIfBacklit = backlit ? theme.white : undefined;
  const darkerIfDark = dark ? theme.colors.dark[4] : theme.colors.gray[4];

  const [recordCount, setRecordCount] = useState(0);

  const getRecordCount = async () => {
    if (Icon) {
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.BACKEND}${metadata.endpoints.one}/count`,
        {
          withCredentials: true,
        }
      );
      setRecordCount(response.data);
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Помилка отримання кількості записів",
        message: (error as Error).toString(),
      });
    }
  };

  useEffect(() => {
    getRecordCount();
  }, []);

  return (
    <Link href={link}>
      <UnstyledButton
        variant="outline"
        w="100%"
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          borderRadius: theme.radius.md,
          height: height,
          backgroundColor: dark ? theme.colors.dark[7] : "white",
          backgroundImage: backlit
            ? `linear-gradient(-60deg, ${
                theme.colors[theme.primaryColor][4 + (dark ? 2 : 0)]
              } 0%, ${
                theme.colors[theme.primaryColor][6 + (dark ? 2 : 0)]
              } 100%)`
            : "none",
          border: backlit ? undefined : `1px solid ${darkerIfDark}`,
          color: whiteIfBacklit,
        }}
      >
        <Flex direction="row" align="center" ml={rem(24)}>
          {Icon ? Icon : <Text size={rem(30)}>{recordCount}</Text>}
          <Divider
            mx={rem(10)}
            color={backlit ? theme.white : darkerIfDark}
            orientation="vertical"
          />
          <Flex direction="column" justify="flex-start">
            <Box mb={rem(5)} style={{ fontSize: rem(24) }} fw={700}>
              {metadata.title}
            </Box>
            {!backlit && <div>в базі даних</div>}
          </Flex>
        </Flex>
      </UnstyledButton>
    </Link>
  );
}
