import axios from "axios";
import { createSignal, onMount } from "solid-js";
import { ToastError } from "./Toast";
import { A } from "@solidjs/router";
import { Button } from "~/ui/components/Button";
import { cx } from "~/ui/utils/cx";
import { Divider } from "~/ui/components/Divider";
import { IconBox } from "~/ui/components/IconBox";

export function EntityButton(props: {
  class?: string;
  href: string;
  icon?: string;
  metadata?: any;
}) {
  const [recordCount, setRecordCount] = createSignal(0);

  const getRecordCount = async () => {
    if (props.icon) {
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND}${props.metadata.endpoints.one}/count`,
        {
          withCredentials: true,
        }
      );
      setRecordCount(response.data);
    } catch (error) {
      ToastError(`Помилка отримання кількості записів\n${error}`);
    }
  };

  onMount(() => {
    getRecordCount();
  });

  return (
    <A href={props.href} class={cx(props.class, "w-full")}>
      <Button
        class={cx(
          "radius",
          "p-3 h-20 w-full flex flex-row items-center justify-items-start"
        )}
        variant={props.icon ? "gradient" : "border"}
      >
        <div class="text-7.5 w-14 flex items-center justify-center">
          {props.icon ? (
            <IconBox variant="unstyle" icon={props.icon} size="md" unpadded />
          ) : (
            recordCount()
          )}
        </div>
        <Divider
          class="ml-3 mr-6 w-px h-full shrink-0"
          variant={props.icon ? "white" : "dim"}
        />
        <div class="flex flex-col items-start">
          <div class="mb-1.25 text-6 font-bold">{props.metadata.title}</div>
          {!props.icon && <div>в базі даних</div>}
        </div>
      </Button>
    </A>
  );
}
