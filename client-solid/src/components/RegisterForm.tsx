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
import { Checkbox } from "~/ui/components/Checkbox";

export const RegisterForm: Component = () => {
  const { register } = useAuth();
  const form = useForm({
    initialState: {
      email: "",
      name: "",
      password: "",
      cookies: true,
    },

    validation: {
      email: (val) => [
        val.trim().length > 0
          ? /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(val)
            ? null
            : "Поганий формат пошти"
          : "Це обов'язкове поле",
      ],
      name: (val) => [
        val.length > 0
          ? val.trim().length > 3
            ? null
            : "Введіть більше, ніж 3 символи"
          : "Це обов'язкове поле",
      ],
      password: (val) => [
        val.length > 0
          ? val.length >= 6
            ? null
            : "Пароль повинен складатися щонайменш з 6 символів"
          : "Це обов'язкове поле",
      ],
      cookies: (val) => [
        val
          ? null
          : "Функціонування облікового запису базується на використанні ваших кукі",
      ],
    },

    submitAction: (state) => {
      register({
        email: state().email,
        name: state().name,
        password: state().password,
      });
    },
  });

  return (
    <div class="flex flex-col items-center gap-6">
      <div class="text-center">
        <Heading order={2} class="font-black">
          Реєстрація
        </Heading>
        <Text size="sm" variant="dim" class="mt-1">
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
            label="Ім'я"
            size="xs"
            error={form.error().name()}
            class="mt-3"
          >
            <Input
              variant="border"
              class="w-full"
              size="md"
              attributes={{
                placeholder: "Як до вас звертатися",
                value: form.state.get().name,
                onInput: (event) =>
                  form.handleChange("name", event.currentTarget.value),
              }}
              valid={form.valid().name()}
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

          <Label
            variant="transparent"
            label="Cookies"
            size="xs"
            error={form.error().cookies()}
            class="mt-3"
          >
            <div class="flex flex-row items-center">
              <div>Я погоджуюся на використання Cookies</div>
              <Checkbox
                class="mr-3"
                attributes={{
                  type: "checkbox",
                  checked: form.state.get().cookies,
                  onChange: (event) =>
                    form.handleChange("cookies", event.currentTarget.checked),
                }}
                valid={form.valid().cookies()}
                size="xs"
              />
            </div>
          </Label>

          <div class="mt-5 flex flex-row items-center justify-between">
            <AnchorButton size="xs" variant="subtle" href="/login">
              Вже є акаунт? Вхід.
            </AnchorButton>
            <Button
              size="md"
              variant="color"
              attributes={{
                type: "submit",
                disabled: !form.canSubmit(),
              }}
            >
              Зареєструватися
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
