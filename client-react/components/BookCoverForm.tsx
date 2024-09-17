import {
  Button,
  Card,
  Center,
  FileButton,
  Flex,
  Text,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconTrash, IconUpload } from "@tabler/icons-react";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export function BookCoverForm({ fromId }: { fromId: number | undefined }) {
  const theme = useMantineTheme();
  const [image, setImage] = useState<string>();

  useEffect(() => {
    getImage();
  }, [fromId]);

  const getImage = async () => {
    try {
      const response = await axios.get(
        `${process.env.BACKEND}/librarian/book/cover/${fromId}`,
        {
          withCredentials: true,
        }
      );
      setImage(
        `data:${response.data.ContentType};base64,${response.data.FileContents}`
      );
    } catch (error) {
      setImage(undefined);
    }
  };

  const submit = async (values: any) => {
    try {
      await axios.post(
        `${process.env.BACKEND}/librarian/book/cover/${fromId}`,
        values,
        {
          withCredentials: true,
        }
      );
      getImage();
      notifications.show({
        color: "green",
        title: "Обкладинку успішно змінено",
        message: "",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Помилка зміни обкладинки",
        message: (error as Error).toString(),
      });
    }
  };

  const clear = async () => {
    try {
      await axios.delete(
        `${process.env.BACKEND}/librarian/book/cover/${fromId}`,
        {
          withCredentials: true,
        }
      );
      getImage();
      notifications.show({
        color: "green",
        title: "Обкладинку успішно видалено",
        message: "",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Помилка видалення обкладинки",
        message: (error as Error).toString(),
      });
    }
  };

  return (
    <Flex gap="xl" direction="column" justify="center" align="stretch">
      <Center>
        <Card
          shadow="xs"
          pos="relative"
          mih={rem(400)}
          miw={rem(260)}
          sx={{
            border: `${rem(1)} solid ${
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[4]
            }`,
          }}
        >
          <Image
            color="gray"
            src={image || "/book/0_cover.svg"}
            alt={""}
            fill={true}
            style={{ objectFit: "cover" }}
          />
        </Card>
      </Center>
      <FileButton
        onChange={(payload) => {
          const formData = new FormData();
          formData.append("file", payload || "");
          submit(formData);
        }}
        accept="image/jpeg"
      >
        {(props) => (
          <Button variant="light" {...props}>
            <IconUpload />
            <Text ml="xs">Завантажити</Text>
          </Button>
        )}
      </FileButton>
      <Button variant="light" color="red" onClick={clear}>
        <IconTrash />
        <Text ml="xs">Видалити</Text>
      </Button>
    </Flex>
  );
}
