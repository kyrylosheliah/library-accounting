import {
  TextInput,
  PasswordInput,
  Checkbox,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Flex,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { Stack } from "@mantine/core";
import { useAuth } from "root/hooks/useAuth";
import Link from "next/link";

export const AuthContent = ({ toggled }: { toggled: "login" | "register" }) => {
  const [type, toggle] = useToggle(["login", "register"]);
  if (type !== toggled) {
    toggle();
  }
  const { register, login } = useAuth();
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Пароль повинен складатися щонайменш з 6 символів"
          : null,
      terms: (val) => !val,
    },
  });
  const isLogin = type === "login";

  return (
    <Container size={420} my={40}>
      <Title align="center" fw={900}>
        {isLogin ? "Вхід" : "Реєстрація"}
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Ласкаво просимо
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form
          onSubmit={form.onSubmit((values) => {
            if (isLogin) {
              login(values.email, values.password);
            } else {
              register(values.name, values.email, values.password);
            }
          })}
        >
          <Stack>
            {!isLogin && (
              <TextInput
                label="Ім'я"
                placeholder="Як до вас звертатися"
                value={form.values.name}
                onChange={(event) =>
                  form.setFieldValue("name", event.currentTarget.value)
                }
                radius="md"
              />
            )}

            <TextInput
              required
              label="Email"
              placeholder="mail@example.com"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "Некоректна пошта"}
              radius="md"
            />

            <PasswordInput
              required
              label="Пароль"
              placeholder="Ваш секрет"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={
                form.errors.password &&
                "Пароль повинен складатися щонайменш з 6 символів"
              }
              radius="md"
            />

            {!isLogin && (
              <Checkbox
                label="Я погоджуюся на використання кукі"
                checked={form.values.terms}
                onChange={(event) =>
                  form.setFieldValue("terms", event.currentTarget.checked)
                }
                error={
                  form.errors.terms && "Наша автентифікація залежить від кукі"
                }
              />
            )}
          </Stack>

          <Flex direction="row" align="center" justify="space-between" mt="xl">
            <Link href={isLogin ? "/register" : "/login"}>
              <Button
                variant="subtle"
                onClick={() => form.setFieldValue("terms", true)}
                size="xs"
                compact
              >
                {isLogin ? "Немає акаунту? Реєстрація." : "Вже є акаунт? Вхід."}
              </Button>
            </Link>
            <Button type="submit">
              {isLogin ? "Увійти" : "Зареєструватися"}
            </Button>
          </Flex>
        </form>
      </Paper>
    </Container>
  );
};
