import { Component, For, JSX, Show, createSignal } from "solid-js";
import { Button } from "./Button";
import { ButtonVariant } from "../Types";
import { cx } from "../utils/cx";

export const Tabs: Component<{
  class?: string;
  initialTabSelected?: string;
  children: Array<{ title: string; content: JSX.Element }>;
  activeVariant: ButtonVariant;
  inactiveVariant: ButtonVariant;
}> = (props) => {
  const [tabSelected, setTabSelected] = createSignal<number | undefined>(
    props.initialTabSelected !== undefined
      ? props.children.map((i) => i.title).indexOf(props.initialTabSelected)
      : undefined
  );

  return (
    <div class={cx(props.class, "flex flex-col items-center")}>
      <div class="flex flex-row items-stretch justify-center">
        <For each={props.children}>
          {(tab, index) => (
            <Button
              attributes={{ onClick: () => setTabSelected(index()) }}
              variant={
                tabSelected() === index()
                  ? props.activeVariant
                  : props.inactiveVariant
              }
              children={tab.title}
            />
          )}
        </For>
      </div>
      <Show
        when={tabSelected() !== undefined}
        children={props.children[tabSelected()!].content}
      />
    </div>
  );
};

{
  /* 

const tabData = [
    {
      title: "Профіль",
      content: (
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
                value={new Date(user()!.record.RegisterDate).toLocaleString()}
              />
            </div>
          </Show>
        </div>
      ),
    },
    {
      title: "Змінити дані",
      content: (
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
      ),
    },
    {
      title: "Членство",
      content: (
        <div>
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
                    onInput: (e) => setAmount(parseFloat(e.target.value) || 0),
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
        </div>
      ),
    },
  ];


<Tabs
          activeVariant="color"
          inactiveVariant="subtle"
          initialTabSelected="Профіль"
          children={tabData}
        />

*/
}
