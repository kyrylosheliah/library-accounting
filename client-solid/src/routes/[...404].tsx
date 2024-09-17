import { Title } from "solid-start";
import { HttpStatusCode } from "solid-start/server";
import { AnchorButton } from "~/ui/components/AnchorButton";
import { Text } from "~/ui/components/Text";
import { Blockquote } from "~/ui/components/Blockquote";
import { Heading } from "~/ui/components/Heading";
import { IconBox } from "~/ui/components/IconBox";
import { IconButton } from "~/ui/components/IconButton";
import { For, createSignal } from "solid-js";
import { Button } from "~/ui/components/Button";
import { useDisclosure } from "~/ui/hooks/useDisclosure";
import { Modal } from "~/ui/components/Modal";
import { Input } from "~/ui/components/Input";
import { Card } from "~/ui/components/Card";
import { InputVariant } from "~/ui/Types";
import { ToastError, ToastInfo, ToastSuccess } from "~/components/Toast";
import { Radio } from "~/ui/components/Radio";
import { Chip } from "~/ui/components/Chip";
import { Checkbox } from "~/ui/components/Checkbox";
import { Pagination } from "~/ui/components/Pagination";
import dayjs from "dayjs";
import { ThemeList } from "~/components/ThemeList";
import { Div } from "~/ui/components/Div";

export default function NotFound() {
  const modalState = useDisclosure(false);

  // let div1: HTMLDivElement;
  // let div2: HTMLDivElement;
  // if (!isServer) {
  //   const promise1 = new Promise<string>((resolve) => {
  //     const start = window.performance.now();
  //     for (let i = 0; i < 1000; ++i) {}
  //     const end = window.performance.now();
  //     resolve(`${end - start} ms`);
  //   });
  //   const promise2 = new Promise<string>((resolve) => {
  //     const start = window.performance.now();
  //     for (let i = 0; i < 1000; ++i) {}
  //     const end = window.performance.now();
  //     resolve(`${end - start} ms`);
  //   });
  //   promise1.then((res) => {
  //     div1.innerHTML = res;
  //   });
  //   promise2.then((res) => {
  //     div2.innerHTML = res;
  //   });
  // }

  const [total, setTotal] = createSignal(10);
  const [page, setPage] = createSignal(1);

  return (
    <>
      <Title>Not Found</Title>
      <HttpStatusCode code={404} />
      <main class="px-5 py-10 sm:py-20 flex flex-col items-center text-center">
        <Text variant="color" class="font-semibold text-lg">
          404
        </Text>
        <Heading class="font-bold" order={1}>
          Сторінку не знайдено
        </Heading>
        <Text class="mt-6">
          Вибачте, сторінку, яку ви шукаєте, не знайдено.
        </Text>
        <AnchorButton
          class="mt-6 flex flex-row items-center"
          href="/"
          size="md"
          variant="border"
        >
          <IconBox
            class="mr-3 inline-block"
            icon="i-tabler-arrow-left"
            variant="subtle"
            size="xs"
          />
          На головну
        </AnchorButton>
      </main>

      <Card class="p-10 my-20 flex flex-col items-center gap-10">
        <Div variant="white">
          123 123
          <br />
          123
          <br />
          123
          <br />
          123
          <br />
          123
          <br />
        </Div>
      </Card>

      {/* <Card class="p-10 my-20 flex flex-row items-center justify-center gap-10">
        <div ref={div1!} class="h-20 w-20 bg-neutral-200 dark:bg-neutral-800">
          0
        </div>
        <div ref={div2!} class="h-20 w-20 bg-neutral-200 dark:bg-neutral-800">
          0
        </div>
      </Card> */}

      <Card class="p-10 my-20 flex flex-col items-center gap-10">
        <Button size="xl"> xl</Button>
        <Button variant="border" size="xl">
          xl
        </Button>
        <Button variant="color" size="xl">
          xl
        </Button>
        <Button variant="dim" size="xl">
          xl
        </Button>
        <Button variant="fill" size="xl">
          xl
        </Button>
        <Button variant="light" size="xl">
          xl
        </Button>
        <Button variant="outline" size="xl">
          xl
        </Button>
        <Button variant="subtle" size="xl">
          xl
        </Button>
        <Button variant="white" size="xl">
          xl
        </Button>
      </Card>

      <Card class="p-10 my-20 flex flex-col items-center gap-10">
        <ThemeList />
      </Card>

      <Card class="p-10 my-20 flex flex-col items-center gap-10">
        <Checkbox size="xl" attributes={{ checked: true }} />
      </Card>

      <Card class="p-10 my-20 flex flex-col items-center gap-10">
        <Input
          size="xl"
          attributes={{
            type: "datetime-local",
            value: "2023-07-19T19:49:02.604Z",
          }}
        />
        <Input
          size="xl"
          attributes={{
            type: "datetime-local",
            value: "2023-07-19T19:49:02.604",
          }}
        />
        <Input
          size="xl"
          attributes={{
            type: "datetime-local",
            value: dayjs("2023-07-19T19:49:02.604Z").format(
              "YYYY-MM-DDTHH:mm:ss.SSS"
            ),
          }}
        />
      </Card>

      <Card class="p-10 my-20 flex flex-row items-center justify-center gap-10">
        <Pagination
          size="xs"
          variant="border"
          activeVariant="fill"
          total={total}
          state={{ get: page, set: setPage }}
          singleStep
          edgeStep
          class="flex flex-row justify-between gap-1"
        />
      </Card>

      <Card class="p-10 my-20 flex flex-row items-center justify-center gap-10">
        <input type="number" />
        <input type="number" inputmode="decimal" step={0.01} />
      </Card>

      <Card class="p-10 my-20 flex flex-row items-center justify-center gap-10">
        <Chip size="xs" unrounded class="rounded-full">
          123
        </Chip>
        <Chip variant="color" size="xs" unrounded class="rounded-full">
          123
        </Chip>
        <Chip variant="outline" size="xs" unrounded class="rounded-full">
          123
        </Chip>
        <Chip variant="light" size="xs" unrounded class="rounded-full">
          123
        </Chip>
        <Chip variant="dim" size="xs" unrounded class="rounded-full">
          123
        </Chip>
        <Chip variant="fill" size="xs" unrounded class="rounded-full">
          123
        </Chip>
      </Card>
      <Card class="p-10 my-20 flex flex-row items-center justify-center gap-10">
        <Chip size="sm">123</Chip>
        <Chip variant="color" size="sm">
          123
        </Chip>
        <Chip variant="light" size="sm">
          123
        </Chip>
        <Chip variant="dim" size="sm">
          123
        </Chip>
        <Chip variant="fill" size="sm">
          123
        </Chip>
      </Card>
      <Card class="p-10 my-20 flex flex-row items-center justify-center gap-10">
        <Chip size="md">123</Chip>
        <Chip variant="color" size="md">
          123
        </Chip>
        <Chip variant="light" size="md">
          123
        </Chip>
        <Chip variant="dim" size="md">
          123
        </Chip>
        <Chip variant="fill" size="md">
          123
        </Chip>
      </Card>
      <Card class="p-10 my-20 flex flex-row items-center justify-center gap-10">
        <Chip size="lg">123</Chip>
        <Chip variant="color" size="lg">
          123
        </Chip>
        <Chip variant="light" size="lg">
          123
        </Chip>
        <Chip variant="dim" size="lg">
          123
        </Chip>
        <Chip variant="fill" size="lg">
          123
        </Chip>
      </Card>
      <Card class="p-10 my-20 flex flex-row items-center justify-center gap-10">
        <Chip size="xl">123</Chip>
        <Chip variant="color" size="xl">
          123
        </Chip>
        <Chip variant="light" size="xl">
          123
        </Chip>
        <Chip variant="dim" size="xl">
          123
        </Chip>
        <Chip variant="fill" size="xl">
          123
        </Chip>
      </Card>

      <Card class="p-10 my-20 flex flex-row items-center justify-center gap-10">
        <Checkbox valid attributes={{ name: "radio1" }} size="xs" />
        <Checkbox valid attributes={{ name: "radio1" }} size="sm" />
        <Checkbox valid attributes={{ name: "radio1" }} size="md" />
        <Checkbox valid attributes={{ name: "radio1" }} size="lg" />
        <Checkbox valid attributes={{ name: "radio1" }} size="xl" />
        <Checkbox
          valid
          variant="outline"
          attributes={{ name: "radio1" }}
          size="xs"
        />
        <Checkbox
          valid
          variant="outline"
          attributes={{ name: "radio1" }}
          size="sm"
        />
        <Checkbox
          valid
          variant="outline"
          attributes={{ name: "radio1" }}
          size="md"
        />
        <Checkbox
          valid
          variant="outline"
          attributes={{ name: "radio1" }}
          size="lg"
        />
        <Checkbox
          valid
          variant="outline"
          attributes={{ name: "radio1" }}
          size="xl"
        />
        <Checkbox
          valid
          variant="color"
          attributes={{ name: "radio1" }}
          size="xs"
        />
        <Checkbox
          valid
          variant="color"
          attributes={{ name: "radio1" }}
          size="sm"
        />
        <Checkbox
          valid
          variant="color"
          attributes={{ name: "radio1" }}
          size="md"
        />
        <Checkbox
          valid
          variant="color"
          attributes={{ name: "radio1" }}
          size="lg"
        />
        <Checkbox
          valid
          variant="color"
          attributes={{ name: "radio1" }}
          size="xl"
        />
        <Checkbox
          valid
          attributes={{ name: "radio1", disabled: true }}
          size="xs"
        />
        <Checkbox
          valid
          attributes={{ name: "radio1", disabled: true }}
          size="sm"
        />
        <Checkbox
          valid
          attributes={{ name: "radio1", disabled: true }}
          size="md"
        />
        <Checkbox
          valid
          attributes={{ name: "radio1", disabled: true }}
          size="lg"
        />
        <Checkbox
          valid
          attributes={{ name: "radio1", disabled: true }}
          size="xl"
        />
      </Card>

      <Card class="p-10 my-20 flex flex-row items-center justify-center gap-10">
        <Checkbox
          valid
          variant="fill"
          attributes={{ name: "radio1" }}
          size="xs"
        />
        <Checkbox
          valid
          variant="fill"
          attributes={{ name: "radio1" }}
          size="sm"
        />
        <Checkbox
          valid
          variant="fill"
          attributes={{ name: "radio1" }}
          size="md"
        />
        <Checkbox
          valid
          variant="fill"
          attributes={{ name: "radio1" }}
          size="lg"
        />
        <Checkbox
          valid
          variant="fill"
          attributes={{ name: "radio1" }}
          size="xl"
        />
        <Checkbox
          valid
          variant="light"
          attributes={{ name: "radio1" }}
          size="xs"
        />
        <Checkbox
          valid
          variant="light"
          attributes={{ name: "radio1" }}
          size="sm"
        />
        <Checkbox
          valid
          variant="light"
          attributes={{ name: "radio1" }}
          size="md"
        />
        <Checkbox
          valid
          variant="light"
          attributes={{ name: "radio1" }}
          size="lg"
        />
        <Checkbox
          valid
          variant="light"
          attributes={{ name: "radio1" }}
          size="xl"
        />
      </Card>

      <Card class="p-10 my-20 flex flex-row items-center justify-center gap-10">
        <Checkbox attributes={{ name: "radio1" }} size="xs" />
        <Checkbox attributes={{ name: "radio1" }} size="sm" />
        <Checkbox attributes={{ name: "radio1" }} size="md" />
        <Checkbox attributes={{ name: "radio1" }} size="lg" />
        <Checkbox attributes={{ name: "radio1" }} size="xl" />
        <Checkbox variant="outline" attributes={{ name: "radio1" }} size="xs" />
        <Checkbox variant="outline" attributes={{ name: "radio1" }} size="sm" />
        <Checkbox variant="outline" attributes={{ name: "radio1" }} size="md" />
        <Checkbox variant="outline" attributes={{ name: "radio1" }} size="lg" />
        <Checkbox variant="outline" attributes={{ name: "radio1" }} size="xl" />
        <Checkbox variant="color" attributes={{ name: "radio1" }} size="xs" />
        <Checkbox variant="color" attributes={{ name: "radio1" }} size="sm" />
        <Checkbox variant="color" attributes={{ name: "radio1" }} size="md" />
        <Checkbox variant="color" attributes={{ name: "radio1" }} size="lg" />
        <Checkbox variant="color" attributes={{ name: "radio1" }} size="xl" />
        <Checkbox attributes={{ name: "radio1", disabled: true }} size="xs" />
        <Checkbox attributes={{ name: "radio1", disabled: true }} size="sm" />
        <Checkbox attributes={{ name: "radio1", disabled: true }} size="md" />
        <Checkbox attributes={{ name: "radio1", disabled: true }} size="lg" />
        <Checkbox attributes={{ name: "radio1", disabled: true }} size="xl" />
      </Card>

      <Card class="p-10 my-20 flex flex-row items-center justify-center gap-10">
        <Checkbox variant="fill" attributes={{ name: "radio1" }} size="xs" />
        <Checkbox variant="fill" attributes={{ name: "radio1" }} size="sm" />
        <Checkbox variant="fill" attributes={{ name: "radio1" }} size="md" />
        <Checkbox variant="fill" attributes={{ name: "radio1" }} size="lg" />
        <Checkbox variant="fill" attributes={{ name: "radio1" }} size="xl" />

        <Checkbox variant="light" attributes={{ name: "radio1" }} size="xs" />
        <Checkbox variant="light" attributes={{ name: "radio1" }} size="sm" />
        <Checkbox variant="light" attributes={{ name: "radio1" }} size="md" />
        <Checkbox variant="light" attributes={{ name: "radio1" }} size="lg" />
        <Checkbox variant="light" attributes={{ name: "radio1" }} size="xl" />
      </Card>

      <Card class="p-10 my-20 flex flex-row items-center justify-center gap-10">
        <Radio attributes={{ name: "radio1", value: "1" }} size="xs" />
        <Radio attributes={{ name: "radio1", value: "2" }} size="sm" />
        <Radio attributes={{ name: "radio1", value: "3" }} size="md" />
        <Radio attributes={{ name: "radio1", value: "4" }} size="lg" />
        <Radio attributes={{ name: "radio1", value: "5" }} size="xl" />
        <Radio attributes={{ name: "radio1", value: "6" }} size="xs" valid />
        <Radio attributes={{ name: "radio1", value: "7" }} size="sm" valid />
        <Radio attributes={{ name: "radio1", value: "8" }} size="md" valid />
        <Radio attributes={{ name: "radio1", value: "9" }} size="lg" valid />
        <Radio attributes={{ name: "radio1", value: "10" }} size="xl" valid />
        <Radio
          attributes={{ name: "radio1", value: "11" }}
          size="xs"
          valid={false}
        />
        <Radio
          attributes={{ name: "radio1", value: "12" }}
          size="sm"
          valid={false}
        />
        <Radio
          attributes={{ name: "radio1", value: "13" }}
          size="md"
          valid={false}
        />
        <Radio
          attributes={{ name: "radio1", value: "14" }}
          size="lg"
          valid={false}
        />
        <Radio
          attributes={{ name: "radio1", value: "15" }}
          size="xl"
          valid={false}
        />
      </Card>
      <Card class="p-10 my-20 flex flex-row items-center justify-center gap-10">
        <Radio
          attributes={{ name: "radio1", value: "16" }}
          variant="color"
          size="xs"
        />
        <Radio
          attributes={{ name: "radio1", value: "17" }}
          variant="color"
          size="sm"
        />
        <Radio
          attributes={{ name: "radio1", value: "18" }}
          variant="color"
          size="md"
        />
        <Radio
          attributes={{ name: "radio1", value: "19" }}
          variant="color"
          size="lg"
        />
        <Radio
          attributes={{ name: "radio1", value: "20" }}
          variant="color"
          size="xl"
        />
        <Radio
          attributes={{ name: "radio1", value: "21" }}
          variant="color"
          size="xs"
          valid
        />
        <Radio
          attributes={{ name: "radio1", value: "22" }}
          variant="color"
          size="sm"
          valid
        />
        <Radio
          attributes={{ name: "radio1", value: "23" }}
          variant="color"
          size="md"
          valid
        />
        <Radio
          attributes={{ name: "radio1", value: "24" }}
          variant="color"
          size="lg"
          valid
        />
        <Radio
          attributes={{ name: "radio1", value: "25" }}
          variant="color"
          size="xl"
          valid
        />
        <Radio
          attributes={{ name: "radio1", value: "26" }}
          variant="color"
          size="xs"
          valid={false}
        />
        <Radio
          attributes={{ name: "radio1", value: "27" }}
          variant="color"
          size="sm"
          valid={false}
        />
        <Radio
          attributes={{ name: "radio1", value: "28" }}
          variant="color"
          size="md"
          valid={false}
        />
        <Radio
          attributes={{ name: "radio1", value: "29" }}
          variant="color"
          size="lg"
          valid={false}
        />
        <Radio
          attributes={{ name: "radio1", value: "30" }}
          variant="color"
          size="xl"
          valid={false}
        />
      </Card>
      <Card class="p-10 my-20 flex flex-row items-center justify-center gap-10">
        <Radio
          variant="dim"
          attributes={{
            name: "radio2",
            value: "1",
          }}
          size="xs"
        />
        <Radio
          variant="dim"
          attributes={{
            name: "radio2",
            value: "2",
          }}
          size="sm"
        />
        <Radio
          variant="dim"
          attributes={{
            name: "radio2",
            value: "3",
          }}
          size="md"
        />
        <Radio
          variant="dim"
          attributes={{
            name: "radio2",
            value: "4",
          }}
          size="lg"
        />
        <Radio
          variant="dim"
          attributes={{
            name: "radio2",
            value: "5",
          }}
          size="xl"
        />
        <Radio
          variant="dim"
          attributes={{
            name: "radio2",
            value: "6",
          }}
          size="xs"
          valid
        />
        <Radio
          variant="dim"
          attributes={{
            name: "radio2",
            value: "7",
          }}
          size="sm"
          valid
        />
        <Radio
          variant="dim"
          attributes={{
            name: "radio2",
            value: "8",
          }}
          size="md"
          valid
        />
        <Radio
          variant="dim"
          attributes={{
            name: "radio2",
            value: "9",
          }}
          size="lg"
          valid
        />
        <Radio
          variant="dim"
          attributes={{
            name: "radio2",
            value: "10",
          }}
          size="xl"
          valid
        />
        <Radio
          variant="dim"
          attributes={{
            name: "radio2",
            value: "11",
          }}
          size="xs"
          valid={false}
        />
        <Radio
          variant="dim"
          attributes={{ name: "radio2", value: "12" }}
          size="sm"
          valid={false}
        />
        <Radio
          variant="dim"
          attributes={{ name: "radio2", value: "13" }}
          size="md"
          valid={false}
        />
        <Radio
          variant="dim"
          attributes={{ name: "radio2", value: "14" }}
          size="lg"
          valid={false}
        />
        <Radio
          variant="dim"
          attributes={{ name: "radio2", value: "15" }}
          size="xl"
          valid={false}
        />
      </Card>

      <Card class="p-10 my-20 flex flex-row items-center justify-center gap-10">
        <IconButton
          icon="i-tabler-notification"
          size="xl"
          attributes={{
            onClick: () => ToastSuccess("text text text\ntext text text text"),
          }}
        />
        <IconButton
          icon="i-tabler-notification"
          size="xl"
          attributes={{
            onClick: () => ToastError("text text text\ntext text text text"),
          }}
        />
        <IconButton
          icon="i-tabler-notification"
          size="xl"
          attributes={{
            onClick: () =>
              ToastInfo(
                "text text text\ntext text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text"
              ),
          }}
        />
      </Card>

      <For each={[undefined, false, true]}>
        {(item) => (
          <Card class="p-10 my-20 flex flex-row items-center justify-center gap-10">
            <For each={[undefined, "border", "fade", "dim", "unstyle"]}>
              {(variant) => (
                <Input
                  size="md"
                  attributes={{ type: "text", placeholder: "placeholder" }}
                  valid={item}
                  variant={variant as InputVariant | undefined}
                />
              )}
            </For>
          </Card>
        )}
      </For>

      <Button
        attributes={{
          onClick: modalState[1].open,
        }}
        size="md"
      >
        open modal
      </Button>
      <Modal
        opened={modalState[0]}
        class="lg:hidden bg-black/75 backdrop-blur-sm flex items-center justify-center"
      >
        <Button
          attributes={{
            onClick: modalState[1].close,
          }}
          size="md"
        >
          close modal
        </Button>
      </Modal>
      <div class="grid grid-cols-1 gap-20 place-items-center">
        <div>
          <AnchorButton href="/library" size="xl">
            <div class="i-tabler-search inline" />
            До пошуку
          </AnchorButton>
          <AnchorButton variant="light" href="/library" size="xl">
            <div class="i-tabler-search inline" /> До пошуку
          </AnchorButton>
          <AnchorButton variant="color" href="/library" size="xl">
            <div class="i-tabler-search inline" /> До пошуку
          </AnchorButton>
          <AnchorButton variant="outline" href="/library" size="xl">
            <div class="i-tabler-search inline" /> До пошуку
          </AnchorButton>
          <AnchorButton variant="subtle" href="/library" size="xl">
            <div class="i-tabler-search inline" /> До пошуку
          </AnchorButton>
          <AnchorButton variant="fill" href="/library" size="xl">
            <div class="i-tabler-search inline" /> До пошуку
          </AnchorButton>
          <AnchorButton variant="white" href="/library" size="xl">
            <div class="i-tabler-search inline" /> До пошуку
          </AnchorButton>
          <AnchorButton variant="unstyle" href="/library" size="xl">
            <div class="i-tabler-search inline" /> До пошуку
          </AnchorButton>
          <AnchorButton variant="border" href="/library" size="xl">
            <div class="i-tabler-search inline" /> До пошуку
          </AnchorButton>
        </div>
        <div>
          <AnchorButton href="/library" size="md">
            <div class="i-tabler-search inline" /> До пошуку
          </AnchorButton>
          <AnchorButton variant="light" href="/library" size="md">
            <div class="i-tabler-search inline" /> До пошуку
          </AnchorButton>
          <AnchorButton variant="color" href="/library" size="md">
            <div class="i-tabler-search inline" /> До пошуку
          </AnchorButton>
          <AnchorButton variant="outline" href="/library" size="md">
            <div class="i-tabler-search inline" /> До пошуку
          </AnchorButton>
          <AnchorButton variant="subtle" href="/library" size="md">
            <div class="i-tabler-search inline" /> До пошуку
          </AnchorButton>
          <AnchorButton variant="fill" href="/library" size="md">
            <div class="i-tabler-search inline" /> До пошуку
          </AnchorButton>
          <AnchorButton variant="white" href="/library" size="md">
            <div class="i-tabler-search inline" /> До пошуку
          </AnchorButton>
          <AnchorButton variant="unstyle" href="/library" size="md">
            <div class="i-tabler-search inline" /> До пошуку
          </AnchorButton>
          <AnchorButton variant="border" href="/library" size="md">
            <div class="i-tabler-search inline" /> До пошуку
          </AnchorButton>
        </div>
        <div>
          <AnchorButton href="/library" size="xs">
            <div class="i-tabler-search inline" /> До пошуку
          </AnchorButton>
          <AnchorButton variant="light" href="/library" size="xs">
            <div class="i-tabler-search inline" /> До пошуку
          </AnchorButton>
          <AnchorButton variant="color" href="/library" size="xs">
            <div class="i-tabler-search inline" /> До пошуку
          </AnchorButton>
          <AnchorButton variant="outline" href="/library" size="xs">
            <div class="i-tabler-search inline" /> До пошуку
          </AnchorButton>
          <AnchorButton variant="subtle" href="/library" size="xs">
            <div class="i-tabler-search inline" /> До пошуку
          </AnchorButton>
          <AnchorButton variant="fill" href="/library" size="xs">
            <div class="i-tabler-search inline" /> До пошуку
          </AnchorButton>
          <AnchorButton variant="white" href="/library" size="xs">
            <div class="i-tabler-search inline" /> До пошуку
          </AnchorButton>
          <AnchorButton variant="unstyle" href="/library" size="xs">
            <div class="i-tabler-search inline" /> До пошуку
          </AnchorButton>
          <AnchorButton variant="border" href="/library" size="xs">
            <div class="i-tabler-search inline" /> До пошуку
          </AnchorButton>
        </div>
        <div>
          <IconButton unpadded icon="i-tabler-search" size="xl" />
          <IconButton
            unpadded
            icon="i-tabler-search"
            size="xl"
            variant="light"
          />
          <IconButton
            unpadded
            icon="i-tabler-search"
            size="xl"
            variant="color"
          />
          <IconButton
            unpadded
            icon="i-tabler-search"
            size="xl"
            variant="outline"
          />
          <IconButton
            unpadded
            icon="i-tabler-search"
            size="xl"
            variant="subtle"
          />
          <IconButton
            unpadded
            icon="i-tabler-search"
            size="xl"
            variant="fill"
          />
          <IconButton
            unpadded
            icon="i-tabler-search"
            size="xl"
            variant="white"
          />
          <IconButton
            unpadded
            icon="i-tabler-search"
            size="xl"
            variant="unstyle"
          />
          <IconButton
            unpadded
            icon="i-tabler-search"
            size="xl"
            variant="border"
          />
        </div>
        <div>
          <IconButton icon="i-tabler-search" size="xl" />
          <IconButton icon="i-tabler-search" size="xl" variant="light" />
          <IconButton icon="i-tabler-search" size="xl" variant="color" />
          <IconButton icon="i-tabler-search" size="xl" variant="outline" />
          <IconButton icon="i-tabler-search" size="xl" variant="subtle" />
          <IconButton icon="i-tabler-search" size="xl" variant="fill" />
          <IconButton icon="i-tabler-search" size="xl" variant="white" />
          <IconButton icon="i-tabler-search" size="xl" variant="unstyle" />
          <IconButton icon="i-tabler-search" size="xl" variant="border" />
        </div>
        <div>
          <IconButton unpadded icon="i-tabler-search" size="md" />
          <IconButton
            unpadded
            icon="i-tabler-search"
            size="md"
            variant="light"
          />
          <IconButton
            unpadded
            icon="i-tabler-search"
            size="md"
            variant="color"
          />
          <IconButton
            unpadded
            icon="i-tabler-search"
            size="md"
            variant="outline"
          />
          <IconButton
            unpadded
            icon="i-tabler-search"
            size="md"
            variant="subtle"
          />
          <IconButton
            unpadded
            icon="i-tabler-search"
            size="md"
            variant="fill"
          />
          <IconButton
            unpadded
            icon="i-tabler-search"
            size="md"
            variant="white"
          />
          <IconButton
            unpadded
            icon="i-tabler-search"
            size="md"
            variant="unstyle"
          />
          <IconButton
            unpadded
            icon="i-tabler-search"
            size="md"
            variant="border"
          />
        </div>
        <div>
          <IconButton icon="i-tabler-search" size="md" />
          <IconButton icon="i-tabler-search" size="md" variant="light" />
          <IconButton icon="i-tabler-search" size="md" variant="color" />
          <IconButton icon="i-tabler-search" size="md" variant="outline" />
          <IconButton icon="i-tabler-search" size="md" variant="subtle" />
          <IconButton icon="i-tabler-search" size="md" variant="fill" />
          <IconButton icon="i-tabler-search" size="md" variant="white" />
          <IconButton icon="i-tabler-search" size="md" variant="unstyle" />
          <IconButton icon="i-tabler-search" size="md" variant="border" />
        </div>
        <div>
          <IconButton unpadded icon="i-tabler-search" size="xs" />
          <IconButton
            unpadded
            icon="i-tabler-search"
            size="xs"
            variant="light"
          />
          <IconButton
            unpadded
            icon="i-tabler-search"
            size="xs"
            variant="color"
          />
          <IconButton
            unpadded
            icon="i-tabler-search"
            size="xs"
            variant="outline"
          />
          <IconButton
            unpadded
            icon="i-tabler-search"
            size="xs"
            variant="subtle"
          />
          <IconButton
            unpadded
            icon="i-tabler-search"
            size="xs"
            variant="fill"
          />
          <IconButton
            unpadded
            icon="i-tabler-search"
            size="xs"
            variant="white"
          />
          <IconButton
            unpadded
            icon="i-tabler-search"
            size="xs"
            variant="unstyle"
          />
          <IconButton
            unpadded
            icon="i-tabler-search"
            size="xs"
            variant="border"
          />
        </div>
        <div>
          <IconButton icon="i-tabler-search" size="xs" />
          <IconButton icon="i-tabler-search" size="xs" variant="light" />
          <IconButton icon="i-tabler-search" size="xs" variant="color" />
          <IconButton icon="i-tabler-search" size="xs" variant="outline" />
          <IconButton icon="i-tabler-search" size="xs" variant="subtle" />
          <IconButton icon="i-tabler-search" size="xs" variant="fill" />
          <IconButton icon="i-tabler-search" size="xs" variant="white" />
          <IconButton icon="i-tabler-search" size="xs" variant="unstyle" />
          <IconButton icon="i-tabler-search" size="xs" variant="border" />
        </div>
        <div>
          <Blockquote
            text="Нехай думки, укладені в книгах, будуть твоїм основним капіталом, а думки, які виникнуть у тебе самого – відсотками з нього"
            author="—Тома Аквінський"
          />
          <Blockquote
            text="Текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст"
            author="—Автор Автор Автор"
          />
        </div>
      </div>
    </>
  );
}
