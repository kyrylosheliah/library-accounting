import {
  Accessor,
  Component,
  For,
  JSX,
  Match,
  Show,
  Switch,
  createEffect,
  createSignal,
  on,
  onMount,
} from "solid-js";
import { Input, InputProps } from "~/ui/components/Input";
import { Label } from "~/ui/components/Label";
import { EntityTable } from "./EntityTable";
import { IAnnotation, IMetadata } from "~/models/_ModelTypes";
import { TextArea, TextAreaProps } from "~/ui/components/TextArea";
import { Checkbox, CheckboxProps } from "~/ui/components/Checkbox";
import { rem } from "~/ui/utils/rem";
import { IconBox } from "~/ui/components/IconBox";
import { IconButton } from "~/ui/components/IconButton";
import { mapToObject } from "~/ui/utils/mapToObject";
import { ControlledFields } from "~/hooks/useCRUD";
import { Dynamic } from "solid-js/web";

const EntityInputField = <T,>(props: {
  key: keyof T;
  annotation: IAnnotation;
  untouched: any;
  value: any;
  metadata: IMetadata<T>;
  handleFormChange: (key: keyof T, value: any) => any;
}) => {
  const keyOrConst =
    props.annotation.type.includes("const") || props.annotation.type === "key";
  const [icon, setIcon] = createSignal<string | undefined>();
  const [component, setComponent] = createSignal<
    Component<InputProps> | Component<TextAreaProps> | Component<CheckboxProps>
  >(Input);
  const [params, setParams] = createSignal<
    InputProps | TextAreaProps | CheckboxProps | {}
  >({});
  const [attributes, setAttributes] = createSignal<
    JSX.InputHTMLAttributes<HTMLInputElement>
  >({});

  const updateIcon = () => {
    switch (props.annotation.type) {
      case "key":
        setIcon("i-tabler-number");
        break;
      case "fkey":
      case "constfkey":
        setIcon("i-tabler-key");
        break;
      case "const":
        setIcon("i-tabler-pencil-off");
        break;
      case "constdatetime":
      case "datetime":
      case "date":
        setIcon("i-tabler-calendar");
        break;
      case "number":
      case "decimal":
      case "string":
      case "text":
      case "boolean":
      case "char":
      default:
        break;
    }
  };

  const updateParams = () => {
    switch (props.annotation.type) {
      case "text":
        setComponent(() => TextArea);
        setParams({ class: "w-full", size: "md", variant: "fade" });
        break;
      case "boolean":
        setComponent(() => Checkbox);
        setParams({
          size: "md",
          variant: "fade",
        });
        break;
      case "key":
      case "fkey":
      case "constfkey":
      case "const":
      case "constdatetime":
      case "datetime":
      case "date":
      case "number":
      case "decimal":
      case "string":
      case "char":
      default:
        setComponent(() => Input);
        setParams({
          class: "w-full",
          size: "md",
          variant: "fade",
        });
        break;
    }
  };

  const updateAttributes = () => {
    switch (props.annotation.type) {
      case "key":
        setAttributes({
          type: "number",
          disabled: true,
          value: props.value || 0,
        });
        break;
      case "fkey":
        setAttributes({
          type: "number",
          disabled: props.annotation.nullable && props.value === null,
          value: props.value || props.untouched || 0,
          placeholder: props.annotation.title,
          onInput: (e) => props.handleFormChange(props.key, e.target.value),
        });
        break;
      case "constfkey":
        setAttributes({
          type: "number",
          disabled: true,
          value: props.value || 0,
        });
        break;
      case "const":
        setAttributes({
          type: "text",
          disabled: true,
          value: props.value || undefined,
        });
        break;
      case "constdatetime":
        setAttributes({
          type: "datetime-local",
          disabled: true,
          value: props.value || undefined,
          onInput: (event) =>
            props.handleFormChange(props.key, event.target.value),
        });
        break;
      case "datetime":
        setAttributes({
          type: "datetime-local",
          disabled: props.annotation.nullable && props.value === null,
          value: props.value || undefined,
          onInput: (event) =>
            props.handleFormChange(props.key, event.target.value),
        });
        break;
      case "date":
        setAttributes({
          type: "date",
          disabled: props.annotation.nullable && props.value === null,
          value: props.value || undefined,
          onInput: (event) =>
            props.handleFormChange(props.key, event.target.value),
        });
        break;
      case "number":
        setAttributes({
          type: "number",
          disabled: props.annotation.nullable && props.value === null,
          placeholder: props.annotation.title,
          value: props.value || 0,
          onInput: (event) =>
            props.handleFormChange(
              props.key,
              typeof event.target.value === "number" ? event.target.value : 0
            ),
        });
        break;
      case "decimal":
        setAttributes({
          type: "number",
          inputmode: "decimal",
          step: 0.01,
          disabled: props.annotation.nullable && props.value === null,
          placeholder: props.annotation.title,
          value: props.value || 0,
          onInput: (event) =>
            props.handleFormChange(
              props.key,
              typeof event.target.value === "number" ? event.target.value : 0
            ),
        });
        break;
      case "string":
        setAttributes({
          type: "text",
          inputmode: "decimal",
          step: 0.01,
          disabled: props.annotation.nullable && props.value === null,
          placeholder: props.annotation.title,
          value: props.value || "",
          width: "100%",
          onInput: (event) =>
            props.handleFormChange(props.key, event.target.value),
        });
        break;
      case "text":
        setAttributes({
          rows: 5,
          disabled: props.annotation.nullable && props.value === null,
          placeholder: props.annotation.title,
          value: props.value || "",
          onInput: (event) =>
            props.handleFormChange(props.key, event.target.value),
        });
        break;
      case "boolean":
        setAttributes({
          checked: props.value,
          onClick: (event) =>
            props.handleFormChange(props.key, event.currentTarget.checked),
        });
        break;
      case "char":
        setAttributes({
          type: "text",
          maxlength: 1,
          disabled: props.annotation.nullable && props.value === null,
          value: props.value || undefined,
          width: rem(36),
          onInput: (event) =>
            props.handleFormChange(
              props.key,
              event.target.value ? event.target.value[0] : ""
            ),
        });
        break;
      default:
        setAttributes({
          type: "text",
          disabled: true,
          value: "*unimplemented*",
        });
        break;
    }
  };

  updateIcon();
  updateParams();
  onMount(() => {
    updateAttributes();
  });
  createEffect(
    on([() => props.untouched, () => props.value], updateAttributes)
  );

  return (
    <>
      <Label
        class="w-full"
        variant="transparent"
        size="xs"
        label={
          <Switch>
            <Match when={icon() !== undefined}>
              <div class="flex flex-row gap-1">
                <IconBox
                  class="shrink-0 h-4 w-4"
                  icon={icon() || ""}
                  unpadded
                />
                <div>{props.annotation.title}</div>
              </div>
            </Match>
            <Match when={icon() === undefined}>{props.annotation.title}</Match>
          </Switch>
        }
      >
        <div class="w-full flex flex-row justify-stretch gap-3">
          <Show when={props.value !== null}>
            <Dynamic
              component={component()}
              {...(params() as any)}
              attributes={attributes()}
            />
          </Show>

          <Switch>
            <Match when={keyOrConst}>
              <IconBox
                class="shrink-0"
                icon="i-tabler-lock"
                variant="dim"
                size="md"
              />
            </Match>
            <Match when={!keyOrConst && props.annotation.nullable}>
              <IconButton
                class="shrink-0"
                icon={props.value === null ? "i-tabler-plus" : "i-tabler-x"}
                attributes={{
                  onClick: () =>
                    props.handleFormChange(
                      props.key,
                      props.value === null
                        ? props.untouched ||
                            (props.metadata.empty as any)[props.key]
                        : null
                    ),
                  type: "button",
                }}
                size="md"
                variant="subtle"
              />
            </Match>
          </Switch>
        </div>
      </Label>
      <Show when={props.annotation.fk !== undefined}>
        <div class="w-full flex overflow-auto">
          <EntityTable
            class="mx-auto shrink"
            metadata={props.annotation.fk!}
            //controlled={props.annotation.fk?.controlled}
            singular={{
              get: () => props.value,
              set: ((val: any) =>
                props.handleFormChange(props.key, val)) as any,
            }}
          />
        </div>
      </Show>
    </>
  );
};

export function EntityForm<T>(props: {
  submit: (request: T) => Promise<void>;
  afterSubmit?: () => void;
  record: Accessor<T>;
  metadata: IMetadata<T>;
  controlled?: Accessor<ControlledFields<T>>;
  class?: string;
  fieldsClass?: string;
  footer?: JSX.Element;
}) {
  const [fields, setFields] = createSignal<T>({
    ...props.record(),
    ...(props.controlled !== undefined
      ? mapToObject<T>(props.controlled())
      : {}),
  });

  createEffect(
    on(props.record, () => {
      if (props.controlled !== undefined) {
        setFields({
          ...props.record(),
          ...mapToObject<T>(props.controlled()),
        });
      } else {
        setFields(props.record() as any);
      }
    })
  );

  const handleFormChange = (key: keyof T, value: any) =>
    setFields((current) => {
      if (props.controlled !== undefined) {
        return {
          ...current,
          [key]: value,
          ...mapToObject<T>(props.controlled()),
        };
      } else {
        return { ...current, [key]: value };
      }
    });

  return (
    <form
      class={props.class}
      onSubmit={(event) => {
        event.preventDefault();
        props.submit(fields());
        if (props.afterSubmit) {
          props.afterSubmit();
        }
      }}
    >
      <div class={props.fieldsClass}>
        <For each={Array.from(Object.entries(props.metadata.annotations))}>
          {(item) => (
            <EntityInputField
              key={item[0] as keyof T}
              annotation={item[1] as any}
              untouched={props.record()[item[0] as keyof T]}
              value={fields()[item[0] as keyof T]}
              metadata={props.metadata}
              handleFormChange={handleFormChange}
              // controlled={
              //   props.controlled
              //     ? props.controlled().findIndex((c) => c.column == item[0]) !==
              //       -1
              //     : false
              // }
            />
          )}
        </For>
      </div>
      {props.footer}
    </form>
  );
}
