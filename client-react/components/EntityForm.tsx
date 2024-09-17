import {
  ActionIcon,
  Button,
  Flex,
  NumberInput,
  TextInput,
  rem,
  useMantineTheme,
  Text,
  Center,
  Checkbox,
  ThemeIcon,
  Textarea,
} from "@mantine/core";
import { DateInput, DateTimePicker } from "@mantine/dates";
import {
  IconCalendar,
  IconCalendarTime,
  IconKey,
  IconLock,
  IconNumber,
  IconPencil,
  IconPencilOff,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { EntityTable } from "./EntityTable";

const EntityField = ({
  index,
  name,
  type,
  nullable,
  fieldUntouched,
  fieldCurrent,
  metadata,
  handleFormChange,
}: {
  index: number;
  name: string;
  type: string;
  nullable: boolean;
  fieldUntouched: any;
  fieldCurrent: any;
  metadata: any;
  handleFormChange: (key: string, value: any) => void;
}) => {
  const theme = useMantineTheme();
  const fieldAnnotation = metadata.annotations[name];
  const isNull = fieldCurrent === null;
  const keyOrConst = type.includes("const") || type === "key";
  let toReturn: JSX.Element;
  let foreignTable: JSX.Element | undefined;
  switch (type) {
    case "key":
      toReturn = (
        <NumberInput
          label={fieldAnnotation.title}
          variant="filled"
          display={nullable && isNull ? "none" : undefined}
          disabled
          value={fieldCurrent || 0}
          icon={<IconNumber />}
        />
      );
      break;
    case "fkey":
      toReturn = (() => {
        const [selected, setSelected] = useState<number | undefined>(
          fieldCurrent
        );
        useEffect(() => setSelected(fieldCurrent), []);
        useEffect(
          () =>
            handleFormChange(name, typeof selected === "number" ? selected : 0),
          [selected]
        );
        foreignTable = !isNull ? (
          <EntityTable
            metadata={fieldAnnotation.foreignTable.metadata}
            untitled={true}
            controlled={fieldAnnotation.foreignTable.controlled}
            singular={{ val: selected, set: setSelected, mod: false }}
            crudEnabled={false}
          />
        ) : undefined;
        return (
          <NumberInput
            label={fieldAnnotation.title}
            variant="filled"
            display={isNull ? "none" : undefined}
            disabled={nullable ? isNull : undefined}
            placeholder={fieldAnnotation.element}
            value={fieldCurrent || 0}
            icon={<IconKey />}
          />
        );
      })();
      break;
    case "constfkey":
      toReturn = (
        <TextInput
          label={fieldAnnotation.title}
          variant="filled"
          display={isNull ? "none" : undefined}
          disabled
          value={fieldCurrent || 0}
          icon={<IconKey />}
        />
      );
      break;
    case "const":
      toReturn = (
        <TextInput
          label={fieldAnnotation.title}
          variant="filled"
          w="100%"
          display={isNull ? "none" : undefined}
          disabled
          value={fieldCurrent || undefined}
          icon={<IconPencilOff />}
        />
      );
      break;
    case "constdate":
      toReturn = (
        <DateTimePicker
          label={fieldAnnotation.title}
          variant="filled"
          valueFormat="YYYY-MM-DD HH:mm"
          display={isNull ? "none" : undefined}
          disabled={true}
          value={fieldCurrent || undefined}
          onChange={(value) => handleFormChange(name, value)}
          icon={<IconCalendarTime />}
        />
      );
      break;
    case "date":
      toReturn = (
        <DateTimePicker
          label={fieldAnnotation.title}
          variant="filled"
          valueFormat="YYYY-MM-DD HH:mm"
          display={isNull ? "none" : undefined}
          disabled={isNull}
          value={fieldCurrent || undefined}
          onChange={(value) => handleFormChange(name, value)}
          icon={<IconCalendarTime />}
        />
      );
      break;
    case "dateonly":
      toReturn = (
        <DateInput
          label={fieldAnnotation.title}
          variant="filled"
          valueFormat="YYYY-MM-DD"
          display={isNull ? "none" : undefined}
          disabled={isNull}
          placeholder={fieldUntouched}
          value={fieldCurrent || undefined}
          onChange={(value) => handleFormChange(name, value)}
          icon={<IconCalendar />}
        />
      );
      break;
    case "number":
      toReturn = (
        <NumberInput
          label={fieldAnnotation.title}
          variant="filled"
          display={nullable && isNull ? "none" : undefined}
          disabled={nullable ? isNull : undefined}
          placeholder={fieldAnnotation.element}
          value={fieldCurrent || 0}
          onChange={(value) =>
            handleFormChange(name, typeof value === "number" ? value : 0)
          }
        />
      );
      break;
    case "decimal":
      toReturn = (
        <NumberInput
          label={fieldAnnotation.title}
          variant="filled"
          display={nullable && isNull ? "none" : undefined}
          disabled={nullable ? isNull : undefined}
          placeholder={fieldAnnotation.element}
          precision={2}
          value={fieldCurrent || 0}
          onChange={(value) =>
            handleFormChange(name, typeof value === "number" ? value : 0)
          }
        />
      );
      break;
    case "string":
      toReturn = (
        <TextInput
          label={fieldAnnotation.title}
          variant="filled"
          w="100%"
          display={nullable && isNull ? "none" : undefined}
          disabled={nullable ? isNull : undefined}
          placeholder={fieldAnnotation.element}
          value={fieldCurrent || ""}
          onChange={(event) => handleFormChange(name, event.target.value)}
        />
      );
      break;
    case "text":
      toReturn = (
        <Textarea
          label={fieldAnnotation.title}
          variant="filled"
          w="100%"
          minRows={5}
          display={nullable && isNull ? "none" : undefined}
          disabled={nullable ? isNull : undefined}
          placeholder={fieldAnnotation.element}
          value={fieldCurrent || ""}
          onChange={(event) => handleFormChange(name, event.target.value)}
        />
      );
      break;
    case "boolean":
      toReturn = (
        <Checkbox
          label={fieldAnnotation.title}
          checked={fieldCurrent}
          onChange={(event) =>
            handleFormChange(name, event.currentTarget.checked)
          }
        />
      );
      break;
    case "char":
      toReturn = (
        <TextInput
          label={fieldAnnotation.title}
          variant="filled"
          w={rem(36)}
          display={isNull ? "none" : undefined}
          disabled={isNull}
          value={fieldCurrent || undefined}
          onChange={(event) =>
            handleFormChange(
              name,
              event.target.value ? event.target.value[0] : ""
            )
          }
        />
      );
      break;
    default:
      toReturn = <Text>Unimplemented</Text>;
      break;
  }

  return [
    <Flex
      w="100%"
      px={theme.fn.smallerThan("md") ? 0 : "xl"}
      key={index}
      direction="row"
      align="flex-end"
      gap="xs"
      sx={{ overflow: "hidden" }}
    >
      {isNull ? (
        <Center h={rem(36)}>
          <Text size="sm" strikethrough>
            {fieldAnnotation.title}
          </Text>
        </Center>
      ) : (
        toReturn
      )}
      {keyOrConst && (
        <Center>
          <ThemeIcon variant="light" size={rem(36)} color="gray">
            <IconLock />
          </ThemeIcon>
        </Center>
      )}
      {!keyOrConst && nullable && (
        <ActionIcon
          disabled={keyOrConst}
          size={rem(36)}
          variant="transparent"
          onClick={() =>
            handleFormChange(name, isNull ? metadata.empty[name] : null)
          }
        >
          {isNull ? (
            <IconPlus color="gray" />
          ) : (
            <IconX color={theme.colors.red[7]} />
          )}
        </ActionIcon>
      )}
    </Flex>,
    foreignTable ? (
      <div
        key={`${index}_foreignTable`}
        style={{ width: "100%", overflow: "auto" }}
      >
        {foreignTable}
      </div>
    ) : (
      foreignTable
    ),
  ];
};

export function EntityForm<T>({
  submit,
  afterSubmit,
  entityRecord,
  metadata,
  controlled,
}: {
  submit: (request: T) => Promise<void>;
  afterSubmit: () => void;
  entityRecord: T;
  metadata: any;
  controlled: { column: string; value: any }[] | undefined;
}) {
  let controlledFields: any = new Object();
  if (controlled) {
    /*controlledFields = controlled.reduce(
      (accumulator, item) => (accumulator[item.column] = item.value),
      controlledFields
    );*/
    for (let item of controlled) {
      controlledFields[item.column] = item.value;
    }
  }
  const [entityFields, setEntityFields] = useState<T>({
    ...entityRecord,
    ...controlledFields,
  });

  useEffect(() => {
    if (controlled) {
      let controlledObject: any = new Object();
      for (let item of controlled) {
        controlledObject[item.column] = item.value;
      }
      setEntityFields({
        ...entityRecord,
        ...controlledObject,
      });
    } else {
      setEntityFields(entityRecord);
    }
  }, [entityRecord]);

  const handleFormChange = (key: string, value: any) => {
    setEntityFields((current) => ({ ...current, [key]: value }));
  };

  const rows =
    controlled === undefined
      ? Array.from(Object.entries(metadata.annotations)).map((item, index) =>
          EntityField({
            index: index,
            name: item[0],
            type: (item[1] as any).type,
            nullable: (item[1] as any).nullable,
            fieldUntouched: (entityRecord as any)[item[0]],
            fieldCurrent: (entityFields as any)[item[0]],
            metadata: metadata,
            handleFormChange: handleFormChange,
          })
        )
      : Array.from(Object.entries(metadata.annotations)).map((item, index) => {
          const controlledIndex = controlled.findIndex(
            (c) => c.column == item[0]
          );
          const isControlled = controlledIndex !== -1;
          const currentType = (item[1] as any).type;
          const type = isControlled
            ? currentType === "fkey"
              ? "constfkey"
              : "const"
            : currentType;
          const untouched = isControlled
            ? controlled[controlledIndex].value
            : (entityRecord as any)[item[0]];
          const current = isControlled
            ? controlled[controlledIndex].value
            : (entityFields as any)[item[0]];
          return EntityField({
            index: index,
            name: item[0],
            type: type,
            nullable: (item[1] as any).nullable,
            fieldUntouched: untouched,
            fieldCurrent: current,
            metadata: metadata,
            handleFormChange: handleFormChange,
          });
        });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit(entityFields);
        afterSubmit();
      }}
    >
      <Flex direction="column" justify="flex-start" align="flex-start" gap="md">
        {rows}
      </Flex>
      <Center mt="xl">
        <Button variant="light" type="submit">
          <IconPencil />
          <Text ml="xs">Застосувати</Text>
        </Button>
      </Center>
    </form>
  );
}
