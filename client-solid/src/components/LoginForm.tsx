import { useAuth } from "~/hooks/useAuth";
import { Heading } from "~/ui/components/Heading";
import { useForm } from "~/ui/hooks/useForm";
import { Text } from "~/ui/components/Text";
import { Card } from "~/ui/components/Card";
import { Input } from "~/ui/components/Input";
import { Label } from "~/ui/components/Label";
import { AnchorButton } from "~/ui/components/AnchorButton";
import { Button } from "~/ui/components/Button";
import { Component } from "solid-js";

export const LoginForm: Component = () => {
  const { login } = useAuth();
  const form = useForm({
    initialState: {
      email: "",
      password: "",
    },

    validation: {
      email: (val) => [
        val.length > 0
          ? /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(val)
            ? null
            : "Поганий формат пошти"
          : "Це обов'язкове поле",
      ],
      password: (val) => [
        val.length > 0
          ? val.length >= 6
            ? null
            : "Пароль повинен складатися щонайменш з 6 символів"
          : "Це обов'язкове поле",
      ],
    },

    submitAction: (state) => {
      login({
        email: state().email,
        password: state().password,
      });
    },
  });

  return (
    <div class="flex flex-col items-center gap-6">
      <div class="text-center">
        <Heading order={2} class="font-black">
          Вхід
        </Heading>
        <Text class="mt-1 text-sm" variant="dim">
          Ласкаво просимо
        </Text>
      </div>
      <Card class="w-96 p-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <Label
            variant="transparent"
            label="Email"
            size="xs"
            error={form.error().email()}
          >
            <Input
              variant="border"
              class="w-full"
              size="md"
              attributes={{
                type: "email",
                placeholder: "mail@example.com",
                value: form.state.get().email,
                onInput: (event) =>
                  form.handleChange("email", event.currentTarget.value),
              }}
              valid={form.valid().email()}
            />
          </Label>

          <Label
            variant="transparent"
            label="Пароль"
            size="xs"
            error={form.error().password()}
            class="mt-3"
          >
            <Input
              variant="border"
              class="w-full"
              size="md"
              attributes={{
                type: "password",
                placeholder: "Ваш секрет",
                value: form.state.get().password,
                onInput: (event) =>
                  form.handleChange("password", event.currentTarget.value),
              }}
              valid={form.valid().password()}
            />
          </Label>

          <div class="mt-5 flex flex-row items-center justify-between">
            <AnchorButton size="xs" variant="subtle" href="/register">
              Немає акаунту? Зареєструватися
            </AnchorButton>
            <Button
              size="md"
              variant="color"
              attributes={{
                type: "submit",
                disabled: !form.canSubmit(),
              }}
            >
              Увійти
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
