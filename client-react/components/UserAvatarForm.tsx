import { Avatar, Button, FileButton, Flex, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconTrash, IconUpload } from "@tabler/icons-react";
import axios from "axios";
import { useAuth } from "root/hooks/useAuth";

export function UserAvatarForm() {
  const { user, assignUser } = useAuth();

  const submit = async (values: any) => {
    try {
      await axios.post(`${process.env.BACKEND}/user/avatar`, values, {
        withCredentials: true,
      });
      assignUser();
      notifications.show({
        color: "green",
        title: "Аватар успішно змінено",
        message: "",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Помилка зміни аватару",
        message: (error as Error).toString(),
      });
    }
  };

  const clear = async () => {
    try {
      await axios.delete(`${process.env.BACKEND}/user/avatar`, {
        withCredentials: true,
      });
      assignUser();
      notifications.show({
        color: "green",
        title: "Аватар успішно видалено",
        message: "",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Помилка видалення аватару",
        message: (error as Error).toString(),
      });
    }
  };

  return (
    <Flex gap="xl" direction="row" justify="center" align="center">
      <Avatar
        src={
          user &&
          user.avatar &&
          `data:${user.avatar.ContentType};base64,${user.avatar.FileContents}`
        }
        size={120}
        radius={120}
        mr="xl"
      />

      <Flex gap="xl" direction="column" justify="center" align="stretch">
        <FileButton
          onChange={(payload) => {
            const formData = new FormData();
            formData.append("file", payload || "");
            submit(formData);
          }}
          accept="image/*"
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
    </Flex>
  );
}
