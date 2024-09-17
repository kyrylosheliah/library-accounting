import axios from "axios";
import { useAuth } from "~/hooks/useAuth";
import { ToastError, ToastSuccess } from "./Toast";
import { FileButton } from "~/ui/components/FileButton";
import { IconBox } from "~/ui/components/IconBox";
import { Button } from "~/ui/components/Button";
import { cx } from "~/ui/utils/cx";
import { themep } from "~/ui/Theme";

const BACKEND = import.meta.env.VITE_BACKEND;

export function UserAvatarForm() {
  const { user, assignUser } = useAuth();

  const submit = async (values: any) => {
    try {
      await axios.post(`${BACKEND}/user/avatar`, values, {
        withCredentials: true,
      });
      assignUser();
      ToastSuccess("Аватар успішно змінено");
    } catch (error) {
      ToastError(`Помилка зміни аватару\n${error}`);
    }
  };

  const clear = async () => {
    try {
      await axios.delete(`${BACKEND}/user/avatar`, {
        withCredentials: true,
      });
      assignUser();
      ToastSuccess("Аватар успішно видалено");
    } catch (error) {
      ToastError(`Помилка зміни аватару\n${error}`);
    }
  };

  return (
    <div class="flex flex-row items-center justify-center gap-3">
      <img
        src={
          user() &&
          user()!.avatar &&
          `data:${user()!.avatar.ContentType};base64,${
            user()!.avatar.FileContents
          }`
        }
        class="w-30 h-30 mr-3"
      />
      <div class="flex flex-col items-stretch justify-center gap-3">
        <FileButton
          attributes={{
            onChange: (e) => {
              if (e.target.files) {
                const formData = new FormData();
                formData.append("file", e.target.files[0] || "");
                submit(formData);
              }
            },
            accept: "image/*",
          }}
          variant="light"
          class="flex flex-row items-center justify-between"
        >
          <div>Завантажити</div>
          <IconBox icon="i-tabler-upload" class="h-7 w-7" variant="unstyle" />
        </FileButton>
        <Button
          variant="unstyle"
          class={cx(
            themep.invalid.text,
            themep.invalid.bg,
            themep.invalid.bg_hover_fill,
            "flex flex-row items-center justify-between"
          )}
          attributes={{
            onClick: clear,
          }}
        >
          <div>Видалити</div>
          <IconBox icon="i-tabler-trash" variant="unstyle" />
        </Button>
      </div>
    </div>
  );
}
