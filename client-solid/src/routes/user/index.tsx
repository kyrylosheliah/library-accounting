import {
  Component,
  For,
  Match,
  Show,
  Switch,
  createSignal,
  onMount,
} from "solid-js";
import { Title } from "solid-start";
import { UserAvatarForm } from "~/components/UserAvatarForm";
import { UserForm } from "~/components/UserForm";
import { UserPasswordForm } from "~/components/UserPasswordForm";
import { useAuth } from "~/hooks/useAuth";
import { useMembership } from "~/hooks/useMembership";
import { AnchorButton } from "~/ui/components/AnchorButton";
import { Card } from "~/ui/components/Card";
import { Heading } from "~/ui/components/Heading";
import { IconBox } from "~/ui/components/IconBox";
import { Text } from "~/ui/components/Text";
import { Label } from "~/ui/components/Label";
import { Input } from "~/ui/components/Input";
import { Button } from "~/ui/components/Button";

const links = [
  {
    title: "Список бажаного",
    icon: "i-tabler-star",
    color: "text-yellow-600",
    href: "/user/wishlist",
  },
  {
    title: "Борг по запозиченнях",
    icon: "i-tabler-hourglass-high",
    color: "text-red-600",
    href: "/user/debt",
  },
  {
    title: "Запозичення та Повернення",
    icon: "i-tabler-receipt",
    color: "text-blue-600",
    href: "/user/borrows",
  },
];

const LabeledField: Component<{ label: string; value: any; icon?: string }> = (
  props
) => (
  <Label
    label={
      <Show when={props.icon} fallback={props.label}>
        <div class="flex flex-row gap-1">
          <IconBox class="shrink-0 h-4 w-4" icon={props.icon!} />
          <div children={props.label} />
        </div>
      </Show>
    }
    variant="transparent"
    size="xs"
  >
    <Text class="text-base" children={props.value} />
  </Label>
);

export default function User() {
  const { user, assignUser } = useAuth();

  const { membership, submit } = useMembership();
  const [amount, setAmount] = createSignal<number>(0);

  const [tabSelected, setTabSelected] = createSignal<string | undefined>(
    "Профіль"
  );

  onMount(assignUser);

  {
    /* <Tabs.Tab value={} icon={<IconUser />}>
    Профіль
  </Tabs.Tab>
  <Tabs.Tab value={} icon={<IconPencil />}>
    Змінити дані
  </Tabs.Tab>
  <Tabs.Tab value={"Членство"} icon={<IconId />}>
    Членство
  </Tabs.Tab> */
  }

  return (
    <>
      <Title>Обліковий запис</Title>
      <main class="px-5 py-10 sm:py-20 flex flex-col items-center justify-center">
        <Heading order={1}>Особистий кабінет</Heading>

        <div class="my-20 flex flex-row gap-3">
          <Button
            attributes={{ onClick: () => setTabSelected("Профіль") }}
            variant={tabSelected() === "Профіль" ? "color" : "subtle"}
            children="Профіль"
          />
          <Button
            attributes={{ onClick: () => setTabSelected("Змінити дані") }}
            variant={tabSelected() === "Змінити дані" ? "color" : "subtle"}
            children="Змінити дані"
          />
          <Button
            attributes={{ onClick: () => setTabSelected("Членство") }}
            variant={tabSelected() === "Членство" ? "color" : "subtle"}
            children="Членство"
          />
          <For each={links}>
            {(item) => (
              <AnchorButton href={item.href}>
                <IconBox
                  size="md"
                  variant="unstyle"
                  class={item.color}
                  icon={item.icon}
                />
                <div class="text-xs mt-20" children={item.title} />
              </AnchorButton>
            )}
          </For>
        </div>

        <Switch>
          <Match when={tabSelected() === "Профіль"}>
            <div>
              <Heading order={2}>Дані користувача</Heading>
              <Show
                when={user() !== undefined}
                fallback={<div>Дані про користувача ще не отримані</div>}
              >
                <div class="flex flex-col">
                  <div class="flex flex-row flex-wrap items-center">
                    <img
                      src={
                        user()!.avatar &&
                        `data:${user()!.avatar.ContentType};base64,${
                          user()!.avatar.FileContents
                        }`
                      }
                      class="mr-3 rounded-full w-30 h-30"
                    />
                    <div class="flex flex-col">
                      <LabeledField label="Код" value={user()!.record.Id} />
                      <LabeledField label="Ім'я" value={user()!.record.Name} />
                    </div>
                  </div>
                  <LabeledField label="Email" value={user()!.record.Email} />
                  <LabeledField
                    label="Номер телефону"
                    value={user()!.record.Phone || "-?-"}
                  />
                  <LabeledField
                    label="Дата народження"
                    value={
                      user()!.record.DateOfBirth
                        ? new Date(user()!.record.DateOfBirth!).toLocaleString()
                        : "-?-"
                    }
                  />
                  <LabeledField
                    label="Адреса"
                    value={user()!.record.Address || "-?-"}
                  />
                  <LabeledField
                    label="Стать"
                    value={user()!.record.Gender || "-?-"}
                  />
                  <LabeledField
                    label="Дата реєстрації"
                    value={new Date(
                      user()!.record.RegisterDate
                    ).toLocaleString()}
                  />
                </div>
              </Show>
            </div>
          </Match>

          <Match when={tabSelected() === "Змінити дані"}>
            <div>
              <div>
                <Heading order={2}>Аватар</Heading>
              </div>
              <Card class="p-3">
                <UserAvatarForm />
              </Card>
              <Heading order={2}>Пароль</Heading>
              <Card class="p-3">
                <UserPasswordForm />
              </Card>
              <Heading order={2}>Інші дані</Heading>
              <Card class="p-3">
                <UserForm />
              </Card>
            </div>
          </Match>

          <Match when={tabSelected() === "Членство"}>
            <Heading order={2}>Членство</Heading>
            <div>
              <div class="flex flex-col items-center gap-3">
                <LabeledField
                  label="Статус"
                  value={membership() ? "Дійсне" : "Відсутнє"}
                  icon={
                    membership()
                      ? "i-tabler-id" // lime
                      : "i-tabler-off" // gray
                  }
                />
                <Show when={membership() !== undefined}>
                  <>
                    <LabeledField
                      label="Початок"
                      value={membership()!.StartDate.toLocaleString()}
                      icon="i-tabler-player-play"
                    />
                    <LabeledField
                      label="Кінець"
                      value={membership()!.ExpirationDate.toLocaleString()}
                      icon="i-tabler-player-stop"
                    />
                  </>
                </Show>
              </div>
            </div>
            <Heading order={2}>Оплата</Heading>
            <Card class="p-3">
              <div class="w-full flex items-end gap-3">
                <Label label="Введіть суму" size="xs">
                  <Input
                    size="md"
                    attributes={{
                      value: amount(),
                      onInput: (e) =>
                        setAmount(parseFloat(e.target.value) || 0),
                      step: 0.000001,
                      min: 0,
                    }}
                  />
                </Label>
                <Button
                  variant="light"
                  attributes={{ onClick: () => submit(amount) }}
                >
                  Сплатити
                </Button>
              </div>
            </Card>
          </Match>
        </Switch>
      </main>
    </>
  );
}
