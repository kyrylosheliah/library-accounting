import { Button, Flex, Center, PasswordInput, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconPencil } from "@tabler/icons-react";
import axios from "axios";

export function UserPasswordForm() {
  const form = useForm({
    initialValues: {
      currentPassword: "",
      password1: "",
      password2: "",
    },

    validate: {
      password1: (val, values) =>
        val.length <= 6
          ? "Пароль повинен складатися щонайменше з 6 символів"
          : val !== values.password2
          ? "Новий пароль повиннен співпадати"
          : null,
      password2: (val, values) =>
        val.length <= 6
          ? "Пароль повинен складатися щонайменше з 6 символів"
          : val !== values.password1
          ? "Новий пароль повиннен співпадати"
          : null,
    },
  });

  const submit = async (values: any) => {
    try {
      await axios.post(`${process.env.BACKEND}/user/password`, values, {
        withCredentials: true,
      });
      form.setValues({
        currentPassword: "",
        password1: "",
        password2: "",
      });
      notifications.show({
        color: "green",
        title: "Пароль успішно змінено",
        message: "",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Помилка зміни паролю",
        message: (error as Error).toString(),
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit((values) => submit(values))}>
      <Flex direction="column" gap="md">
        <PasswordInput
          required
          label="Поточний пароль"
          placeholder="поточний пароль"
          {...form.getInputProps("currentPassword")}
        />
        <PasswordInput
          required
          label="Новий пароль"
          placeholder="новий пароль"
          {...form.getInputProps("password1")}
        />
        <PasswordInput
          required
          label="Повторіть новий пароль"
          placeholder="новий пароль"
          {...form.getInputProps("password2")}
        />
      </Flex>
      <Center mt="xl">
        <Button variant="light" type="submit">
          <IconPencil />
          <Text ml="xs">Застосувати</Text>
        </Button>
      </Center>
    </form>
  );
}
