import axios from "axios";
import { useForm } from "~/ui/hooks/useForm";
import { ToastError, ToastSuccess } from "./Toast";
import { Input } from "~/ui/components/Input";
import { Label } from "~/ui/components/Label";
import { Button } from "~/ui/components/Button";
import { IconBox } from "~/ui/components/IconBox";

const BACKEND = import.meta.env.VITE_BACKEND;

export function UserPasswordForm() {
  const form = useForm({
    initialState: {
      currentPassword: "",
      password1: "",
      password2: "",
    },

    validation: {
      currentPassword: () => [null],
      password1: (val, values) => [
        val.length <= 6
          ? "Пароль повинен складатися щонайменше з 6 символів"
          : null,
        val !== values.password2 ? "Новий пароль повиннен співпадати" : null,
      ],
      password2: (val, values) => [
        val.length <= 6
          ? "Пароль повинен складатися щонайменше з 6 символів"
          : null,
        val !== values.password1 ? "Новий пароль повиннен співпадати" : null,
      ],
    },

    submitAction: (state) => {
      submit(form.state.get());
    },
  });

  const submit = async (values: any) => {
    try {
      await axios.post(`${BACKEND}/user/password`, values, {
        withCredentials: true,
      });
      form.state.set({
        currentPassword: "",
        password1: "",
        password2: "",
      });
      ToastSuccess("Пароль успішно змінено");
    } catch (error) {
      ToastError(`Помилка зміни паролю\n${error}`);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div class="flex flex-col gap-3">
        <Label
          label="Поточний пароль"
          size="xs"
          error={form.error().currentPassword()}
        >
          <Input
            size="md"
            attributes={{
              type: "password",
              placeholder: "Поточний пароль",
              checked: form.state.get().currentPassword,
              onInput: (event) =>
                form.handleChange("currentPassword", event.currentTarget.value),
            }}
          />
        </Label>
        <Label label="Новий пароль" size="xs" error={form.error().password1()}>
          <Input
            size="md"
            attributes={{
              type: "password",
              placeholder: "Новий пароль",
              checked: form.state.get().password1,
              onInput: (event) =>
                form.handleChange("password1", event.currentTarget.value),
            }}
          />
        </Label>
        <Label label="Новий пароль" size="xs" error={form.error().password2()}>
          <Input
            size="md"
            attributes={{
              type: "password",
              placeholder: "Повторіть новий пароль",
              checked: form.state.get().password2,
              onInput: (event) =>
                form.handleChange("password2", event.currentTarget.value),
            }}
          />
        </Label>
      </div>
      <div class="mt-10 flex items-center justify-center">
        <Button variant="light" attributes={{ type: "submit" }}>
          <div class="flex flex-row items-center">
            <div>Застосувати</div>
            <IconBox icon="i-tabler-pencil" size="xs" />
          </div>
        </Button>
      </div>
    </form>
  );
}
