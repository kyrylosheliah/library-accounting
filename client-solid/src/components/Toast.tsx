import toast from "solid-toast";
import { themeg, themep } from "~/ui/Theme";
import { IconBox } from "~/ui/components/IconBox";
import { cx } from "~/ui/utils/cx";
import { Text } from "~/ui/components/Text";
import { JSX } from "solid-js";
import { IconButton } from "~/ui/components/IconButton";
import { Card } from "~/ui/components/Card";

const toastMiddleware = (icon: JSX.Element, message: JSX.Element) =>
  toast.custom(
    (t) => (
      <Card
        class={"p-2 max-w-sm flex flex-row gap-2"}
        children={[
          icon,
          <Text class="flex flex-col whitespace-pre-line" children={message} />,
          <IconButton
            attributes={{ onClick: () => toast.dismiss(t.id) }}
            class="self-start shrink-0"
            icon="i-tabler-x"
            size="xs"
            variant="unstyle"
          />,
        ]}
      />
    ),
    {
      duration: 10000,
      unmountDelay: 0,
    }
  );

export const ToastSuccess = (message: JSX.Element) =>
  toastMiddleware(
    <IconBox
      icon="i-tabler-check"
      variant="unstyle"
      class={cx(themep.valid.text, themep.valid.bg, "rounded-full shrink-0")}
      size="sm"
    />,
    message
  );

export const ToastError = (message: JSX.Element) =>
  toastMiddleware(
    <IconBox
      icon="i-tabler-x"
      variant="unstyle"
      class={cx(
        themep.invalid.text,
        themep.invalid.bg,
        "rounded-full shrink-0"
      )}
      size="sm"
    />,
    message
  );

export const ToastInfo = (message: JSX.Element) =>
  toastMiddleware(
    <IconBox
      icon="i-tabler-info-small"
      variant="unstyle"
      class={cx(themep.light.text, themep.light.bg, "rounded-full shrink-0")}
      size="sm"
    />,
    message
  );
