import {
  Accessor,
  For,
  Setter,
  Show,
  createEffect,
  createSignal,
  on,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { ControlledFields, useCRUD } from "~/hooks/useCRUD";
import { IMetadata } from "~/models/_ModelTypes";
import { themep } from "~/ui/Theme";
import { Button } from "~/ui/components/Button";
import { Card } from "~/ui/components/Card";
import { Checkbox } from "~/ui/components/Checkbox";
import { Chip } from "~/ui/components/Chip";
import { IconBox } from "~/ui/components/IconBox";
import { IconButton } from "~/ui/components/IconButton";
import { Input } from "~/ui/components/Input";
import { Modal } from "~/ui/components/Modal";
import { Radio } from "~/ui/components/Radio";
import { useDisclosure } from "~/ui/hooks/useDisclosure";
import { cx } from "~/ui/utils/cx";
import { EntityForm } from "./EntityForm";
import { Text } from "~/ui/components/Text";
import { Pagination } from "~/ui/components/Pagination";
import { Divider } from "~/ui/components/Divider";

const dateRegex = new RegExp(
  "^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9]).*$"
);

function EntityTableField(props: { class?: string; field: any }) {
  switch (typeof props.field) {
    case "boolean":
      return (
        <div class="flex flex-row items-center justify-center">
          <IconBox
            icon={props.field ? "i-tabler-check" : ""}
            size="xs"
            unpadded
            class={cx(props.class, "text-center")}
          />
        </div>
      );
    case "object":
      return (
        <div class="flex flex-row items-center justify-center">
          <Show
            when={props.field === null}
            fallback={
              <div class={props.class}>
                {(props.field as Object).toString()}
              </div>
            }
          >
            <IconBox
              icon="i-tabler-question-mark"
              class={cx(props.class, themep.dim.text, "text-center")}
              size="xs"
              unpadded
              variant="unstyle"
            />
          </Show>
        </div>
      );
    case "undefined":
      return undefined;
    case "string":
      return (
        <Text
          class={cx(
            props.class,
            props.field === "text"
              ? "overflow-auto max-w-75"
              : "whitespace-nowrap",
            props.field.length > 100 && "break-all",
            "text-left"
          )}
        >
          {dateRegex.test(props.field)
            ? new Date(props.field).toLocaleString()
            : props.field.length > 100
            ? props.field.slice(0, 100) + "..."
            : props.field}
        </Text>
      );
    //case "number":
    default:
      return (
        <Text class={cx(props.class, "whitespace-nowrap")}>{props.field}</Text>
      );
  }
}

function ModalStyled<T>(props: {
  opened: Accessor<boolean>;
  icon: string;
  iconColor: string;
  heading: string;
  close: () => void;
  update: (request: T) => Promise<void>;
  record: Accessor<T>;
  metadata: IMetadata<T>;
}) {
  return (
    <Modal
      opened={props.opened}
      class="flex flex-col items-center justify-center backdrop-blur-sm bg-transparent"
    >
      <div class="p-2 m-5 w-full max-w-3xl gap-5 overflow-y-auto">
        <Card
          class={cx(themep.default.bg, "w-full flex flex-col align-stretch")}
        >
          <div class="p-3 flex flex-row justify-between items-center">
            <div>
              <IconBox
                icon={props.icon}
                size="md"
                variant="unstyle"
                class={cx("grow-x basis-0", props.iconColor)}
              />
            </div>
            <Text class="text-xl">{props.heading}</Text>
            <div>
              <IconButton
                class="grow-x basis-0"
                icon="i-tabler-x"
                variant="fill"
                size="md"
                attributes={{ onClick: props.close }}
              />
            </div>
          </div>
          <Divider variant="dim" class="h-px w-full" />
          <EntityForm<T>
            fieldsClass="p-3 flex flex-col items-stretch gap-3"
            submit={props.update}
            afterSubmit={props.close}
            record={props.record}
            metadata={props.metadata}
            //controlled={props.controlled}
            footer={
              <>
                <Divider variant="dim" class="h-px w-full" />
                <div class="p-3 flex items-center justify-center">
                  <Button
                    variant="light"
                    attributes={{
                      type: "submit",
                    }}
                    class="self-center pl-1 pr-3 flex flex-row items-center"
                  >
                    <IconBox
                      icon="i-tabler-pencil"
                      size="md"
                      variant="unstyle"
                    />
                    <div>Застосувати</div>
                  </Button>
                </div>
              </>
            }
          />
        </Card>
      </div>
    </Modal>
  );
}

export function EntityTable<T>(props: {
  metadata: IMetadata<T>;
  controlled?: Accessor<ControlledFields<T>>;
  singular?: {
    get: Accessor<number | undefined>;
    set: Setter<number | undefined>;
  };
  class?: string;
  create?: boolean;
  refresh?: boolean;
  edit?: boolean;
  delete?: boolean;
}) {
  const columnCount = Object.keys(props.metadata.default as any).length + 1;

  const [createOpened, createDisclosure] = useDisclosure(false);
  const [editOpened, editDisclosure] = useDisclosure(false);

  const {
    dataOne,
    dataMany,
    Create,
    ReadOne,
    ReadMany,
    Update,
    Delete,
    searchPageCount,
    page: { pageNo, setPageNo },
    ascending: { ascending, setAscending },
    queryFields: { orderByColumn, setOrderByColumn, valueTyped, setValueTyped },
  } = useCRUD<T>(props.metadata.endpoints, props.controlled);
  const [orderBy, setOrderBy] = createSignal<number>(0);
  const [fieldData, setFieldData] = createSignal<any[][]>([]);

  const [selection, setSelection] = createSignal<any[]>(
    props.singular ? [props.singular.get()] : []
  );
  const toggleRow = (id: any) =>
    props.singular
      ? props.singular.set(id)
      : setSelection((current) =>
          current.includes(id)
            ? current.filter((item) => item !== id)
            : [...current, id]
        );
  const toggleAll = () =>
    props.singular
      ? props.singular.set(undefined)
      : setSelection((current) =>
          current.length
            ? []
            : current.length === fieldData().length
            ? []
            : fieldData().map((item) => item[0])
        );

  createEffect(
    on(dataOne, () => {
      if (props.singular) {
        props.singular.set(
          (dataOne() as any).Id === null ? 0 : (dataOne() as any).Id
        );
      }
    })
  );

  createEffect(
    on([dataMany, props.controlled ? props.controlled : () => []], () => {
      setFieldData(
        dataMany().map((item) =>
          Object.values(item as any).map((item) => item as any)
        )
      );
      if (props.singular) {
        props.singular.set(undefined);
      } else {
        setSelection((current) =>
          current.filter((selected) =>
            fieldData().find((row) => row[0] === selected)
          )
        );
      }
    })
  );

  createEffect(on(props.controlled ? props.controlled : () => [], ReadMany));

  createEffect(
    on(editOpened, (val) => {
      if (val) {
        ReadOne(
          props.singular
            ? props.singular.get() || -1
            : selection().length === 1
            ? selection()[0]
            : -1,
          props.metadata.default
        );
      } else {
        ReadOne(-1, props.metadata.default);
      }
    })
  );

  return (
    <Card class={cx(props.class, "p-2 flex flex-col items-stretch gap-1")}>
      <Show when={props.controlled || valueTyped()}>
        <div class="flex items-center gap-2">
          <Text class="text-xs">Фільтр:</Text>
          <Show when={props.controlled}>
            <For each={props.controlled!()}>
              {(field) => (
                <Chip
                  variant="outline"
                  size="xs"
                  attributes={{ checked: field.value !== undefined }}
                  children={
                    field.value === undefined
                      ? `оберіть [${
                          props.metadata.annotations[field.column].title
                        }]`
                      : `[${
                          props.metadata.annotations[field.column].title
                        }] включає '${field.value}'`
                  }
                />
              )}
            </For>
          </Show>
          <Show when={valueTyped()}>
            <Chip variant="outline" size="xs" attributes={{ checked: true }}>
              {`[${
                props.metadata.annotations[orderByColumn()].title
              }] включає '${valueTyped()}'`}
            </Chip>
          </Show>
        </div>
      </Show>

      <div class="flex flex-row justify-stretch gap-2">
        <IconBox icon="i-tabler-search" class="shrink-0" size="md" />
        <Input
          variant="fade"
          size="md"
          class="w-full"
          attributes={{
            placeholder: "Шукайте за полем сортування",
            value: valueTyped(),
            onInput: (e) => setValueTyped(e.currentTarget.value),
          }}
        />
        <Show when={valueTyped()}>
          <IconButton
            icon="i-tabler-x"
            class="shrink-0"
            attributes={{
              onClick: () => {
                setValueTyped("");
                ReadMany();
              },
            }}
            size="md"
          />
        </Show>

        <Show when={props.create}>
          <ModalStyled
            opened={createOpened}
            icon="i-tabler-plus"
            iconColor="text-lime-500 bg-lime-600/10 dark:text-white dark:bg-transparent"
            heading={`Додавання запису у ${props.metadata.title}`}
            close={createDisclosure.close}
            update={Create}
            record={() => props.metadata.default}
            metadata={props.metadata}
          />
          <IconButton
            icon="i-tabler-plus"
            size="md"
            variant="light"
            class="shrink-0 text-lime-600 dark:text-white"
            attributes={{
              title: "Створити",
              onClick: createDisclosure.open,
            }}
          />
        </Show>
        <Show
          when={
            props.edit &&
            (props.singular
              ? props.singular.get() !== undefined
              : selection().length === 1)
          }
        >
          <ModalStyled
            opened={editOpened}
            icon="i-tabler-edit"
            iconColor="text-amber-500 dark:text-white"
            heading={`Редагування запису у ${props.metadata.title}`}
            close={editDisclosure.close}
            update={Update}
            record={dataOne}
            metadata={props.metadata}
          />
          <IconButton
            icon="i-tabler-edit"
            size="md"
            variant="light"
            attributes={{
              title: "Редагувати",
              onClick: editDisclosure.open,
            }}
            class="shrink-0 text-amber-600 dark:text-white"
          />
        </Show>
        <Show when={props.refresh}>
          <IconButton
            icon="i-tabler-refresh"
            size="md"
            variant="light"
            attributes={{
              title: "Оновити",
              onClick: ReadMany,
            }}
            class="shrink-0 text-blue-600 dark:text-white"
          />
        </Show>
        <Show when={props.delete}>
          <IconButton
            icon="i-tabler-trash"
            size="md"
            variant="light"
            attributes={{
              title: "Видалити",
              onClick: () =>
                Delete(
                  props.singular
                    ? props.singular.get()
                      ? [props.singular.get()]
                      : []
                    : selection()
                ),
            }}
            class="shrink-0 text-red-600 dark:text-white"
          />
        </Show>
      </div>

      <div class="w-full">
        <div class="w-full overflow-x-auto">
          <table class="w-full">
            <thead class="whitespace-nowrap">
              <tr>
                <th>
                  <Show
                    when={props.singular === undefined}
                    fallback={
                      <Radio
                        size="xs"
                        variant="fill"
                        attributes={{
                          onClick: toggleAll,
                          checked: false,
                        }}
                        indeterminate={
                          props.singular!.get() !== undefined ? true : undefined
                        }
                      />
                    }
                  >
                    <Checkbox
                      size="xs"
                      variant="fill"
                      attributes={{
                        onClick: toggleAll,
                        checked:
                          selection().length !== 0 &&
                          selection().length === dataMany().length,
                      }}
                      indeterminate={
                        selection().length !== 0 &&
                        selection().length !== dataMany().length
                      }
                    />
                  </Show>
                </th>
                <For each={Object.keys(props.metadata.default as any)}>
                  {(key, index) => (
                    <th>
                      <Button
                        variant={orderByColumn() === key ? "fill" : undefined}
                        unpadded
                        attributes={{
                          onClick: () => {
                            setAscending(
                              orderBy() === index() ? !ascending() : false
                            );
                            setOrderBy(index());
                            setOrderByColumn(() => key as keyof T);
                          },
                        }}
                        class="px-1 pl-3 pr-1 h-full w-full flex flex-row items-center justify-between gap-1"
                      >
                        <div class="font-semibold">
                          {props.metadata.annotations[key as keyof T].title}
                        </div>
                        <IconBox
                          icon={
                            (orderBy() === index() &&
                              (ascending()
                                ? "i-tabler-chevron-down"
                                : "i-tabler-chevron-up")) ||
                            "i-tabler-selector"
                          }
                          variant="unstyle"
                          class={cx(
                            orderBy() === index() ? undefined : "opacity-20",
                            "shrink-0"
                          )}
                          size="md"
                        />
                      </Button>
                    </th>
                  )}
                </For>
              </tr>
            </thead>
            <tbody>
              <For
                each={fieldData()}
                fallback={
                  <tr>
                    <td colSpan={columnCount}>
                      <Text class="font-semibold text-center">Не знайдено</Text>
                    </td>
                  </tr>
                }
              >
                {(row) => (
                  <tr>
                    <td
                      class={cx(
                        (props.singular
                          ? props.singular.get() === row[0]
                          : selection().includes(row[0])) && themep.light.bg,
                        "p-1"
                      )}
                    >
                      <Dynamic
                        component={props.singular ? Radio : Checkbox}
                        variant="fill"
                        size="xs"
                        attributes={{
                          checked: props.singular
                            ? props.singular.get() === row[0]
                            : selection().includes(row[0]),
                          onClick: () => toggleRow(row[0]),
                        }}
                      />
                    </td>
                    <For each={row}>
                      {(field) => (
                        <td
                          class={cx(
                            (props.singular
                              ? props.singular.get() === row[0]
                              : selection().includes(row[0])) &&
                              themep.light.bg,
                            "px-3 py-1"
                          )}
                        >
                          <EntityTableField field={field} />
                        </td>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        size="xs"
        state={{ get: pageNo, set: setPageNo }}
        total={searchPageCount}
        class="mx-auto flex flex-row gap-1"
        variant="subtle"
        activeVariant="fill"
        neighbours={0}
        singleStep
        edgeStep
      />
    </Card>
  );
}
