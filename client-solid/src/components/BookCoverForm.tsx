import axios from "axios";
import { Accessor, Show, createEffect, createSignal, on } from "solid-js";
import { ToastError, ToastSuccess } from "./Toast";
import { Card } from "~/ui/components/Card";
import { FileButton } from "~/ui/components/FileButton";
import { Button } from "~/ui/components/Button";
import { IconBox } from "~/ui/components/IconBox";
import { cx } from "~/ui/utils/cx";
import { themep } from "~/ui/Theme";

const BACKEND = import.meta.env.VITE_BACKEND;

export function BookCoverForm(props: { id: Accessor<number | undefined> }) {
  const [image, setImage] = createSignal<string>();

  createEffect(
    on(props.id, () => {
      if (props.id() === undefined) {
        setImage(undefined);
      } else {
        getImage();
      }
    })
  );

  const getImage = async () => {
    try {
      const response = await axios.get(
        `${BACKEND}/librarian/book/cover/${props.id()}`,
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
        `${BACKEND}/librarian/book/cover/${props.id()}`,
        values,
        {
          withCredentials: true,
        }
      );
      getImage();
      ToastSuccess("Обкладинку успішно змінено");
    } catch (error) {
      ToastError(`Помилка зміни обкладинки\n${error}`);
    }
  };

  const clear = async () => {
    try {
      await axios.delete(`${BACKEND}/librarian/book/cover/${props.id()}`, {
        withCredentials: true,
      });
      getImage();
      ToastSuccess("Обкладинку успішно видалено");
    } catch (error) {
      ToastError(`Помилка видалення обкладинки\n${error}`);
    }
  };

  return (
    <div class="flex flex-col items-stretch justify-center gap-3">
      <Card class="flex items-center justify-center">
        <Show
          when={image()}
          fallback={<div class="i-tabler-question-mark text-gray w-30 h-30" />}
        >
          <img color="gray" class="object-cover" src={image!()} />
        </Show>
      </Card>
      <FileButton
        size="xl"
        attributes={{
          onChange: (e) => {
            if (e.target.files) {
              const formData = new FormData();
              formData.append("file", e.target.files[0] || "");
              submit(formData);
            }
          },
          accept: "image/jpeg",
        }}
        variant="light"
        class="flex flex-row items-center justify-between"
      >
        <div>Завантажити</div>
        <IconBox icon="i-tabler-upload" class="h-7 w-7" variant="unstyle" />
      </FileButton>
      <Button
        variant="unstyle"
        size="xl"
        class={cx(
          themep.invalid.text,
          themep.invalid.bg,
          themep.invalid.bg_hover,
          "flex flex-row justify-between"
        )}
        attributes={{
          onClick: clear,
        }}
      >
        <div>Видалити</div>
        <IconBox icon="i-tabler-trash" variant="unstyle" class="h-7 w-7" />
      </Button>
    </div>
  );
}
