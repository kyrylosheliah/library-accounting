import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  createStyles,
  Table,
  UnstyledButton,
  Text,
  Center,
  TextInput,
  rem,
  Checkbox,
  ActionIcon,
  useMantineTheme,
  Flex,
  Title,
  Modal,
  Pagination,
  Radio,
  Chip,
  Group,
  ThemeIcon,
  Paper,
} from "@mantine/core";
import {
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconPlus,
  IconQuestionMark,
  IconRefresh,
  IconSearch,
  IconSelector,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useCRUD } from "root/hooks/useCRUD";
import { EntityForm } from "./EntityForm";
import { useDisclosure } from "@mantine/hooks";

const useStyles = createStyles((theme) => ({
  control: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[4],
    },
  },

  selected: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.fn.rgba(theme.colors[theme.primaryColor][6], 0.1)
        : theme.colors[theme.primaryColor][0],
  },
}));

export function EntityTable<T>({
  metadata,
  untitled,
  controlled,
  singular,
  crudEnabled,
}: {
  metadata: any;
  untitled: boolean;
  controlled: { column: string; value: any }[] | undefined;
  singular:
    | {
        val: number | undefined;
        set: Dispatch<SetStateAction<number | undefined>>;
        mod: boolean;
      }
    | undefined;
  crudEnabled: boolean;
}) {
  const theme = useMantineTheme();
  const dark = theme.colorScheme === "dark";
  const { classes, cx } = useStyles();

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
  } = useCRUD<T>(metadata.endpoints, controlled);
  const [orderBy, setOrderBy] = useState<number>(0);
  const [fieldData, setFieldData] = useState<any[][]>([]);

  const [selection, setSelection] = useState<any[]>(
    singular ? [singular.val] : []
  );
  const toggleRow = (id: any) =>
    singular
      ? singular.set(id)
      : setSelection((current) =>
          current.includes(id)
            ? current.filter((item) => item !== id)
            : [...current, id]
        );
  const toggleAll = () =>
    singular
      ? singular.set(undefined)
      : setSelection((current) =>
          current.length
            ? []
            : current.length === fieldData.length
            ? []
            : fieldData.map((item) => item[0])
        );

  const columns = Object.keys(metadata.default).map((item, index) => {
    const Icon =
      orderBy === index
        ? ascending
          ? IconChevronDown
          : IconChevronUp
        : undefined;
    return (
      <th
        style={{ padding: 0, height: rem(40) }}
        className={cx({ [classes.selected]: orderByColumn === item })}
        key={`column_${index}`}
      >
        <UnstyledButton
          onClick={() => {
            const reversed =
              orderBy === index
                ? !ascending
                : item.includes("Id")
                ? false
                : true;
            setAscending(reversed);
            setOrderBy(index);
            setOrderByColumn(item);
          }}
          className={classes.control}
        >
          <Text px={rem(10)} fw={600} fz="sm">
            {metadata.annotations[item].title}
          </Text>
          <Center>{Icon ? <Icon /> : <IconSelector opacity={0.2} />}</Center>
        </UnstyledButton>
      </th>
    );
  });

  const dateRegex = new RegExp(
    "^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9]).*$"
  );
  const rows = fieldData.map((item, index) => (
    <tr
      key={`row_${index}`}
      className={cx({
        [classes.selected]: singular
          ? singular.val === item[0]
          : selection.includes(item[0]),
      })}
    >
      <td style={{ width: rem(40) }}>
        {singular ? (
          <Radio
            checked={singular.val === item[0]}
            onChange={() => singular.set(item[0])}
          />
        ) : (
          <Checkbox
            checked={selection.includes(item[0])}
            onChange={() => toggleRow(item[0])}
          />
        )}
      </td>
      {item.map((field: any, i_index) => (
        <td key={`field_${i_index}`}>
          {field ? (
            typeof field == "boolean" ? (
              field ? (
                <Center>
                  <IconCheck />
                </Center>
              ) : (
                ""
              )
            ) : (
              <div style={{ overflow: "auto", maxWidth: rem(600) }}>
                {dateRegex.test(field)
                  ? new Date(field).toLocaleString()
                  : field}
              </div>
            )
          ) : (
            <Center>
              {field == null ? (
                <IconQuestionMark color="gray" />
              ) : typeof field == "number" ? (
                field
              ) : (
                ""
              )}
            </Center>
          )}
        </td>
      ))}
    </tr>
  ));

  useEffect(() => {
    if (singular) {
      singular.set((dataOne as any).Id === null ? 0 : (dataOne as any).Id);
    }
  }, [dataOne]);

  useEffect(() => {
    setFieldData(
      dataMany.map((item) =>
        Object.values(item as any).map((item) => item as any)
      )
    );
    if (singular) {
      singular.set(undefined);
    } else {
      setSelection((current) =>
        current.filter((f) => fieldData.find((fd) => fd[0] === f))
      );
    }
  }, [dataMany]);

  return (
    <Paper
      sx={{
        overflow: "auto",
        backgroundColor: undefined,
        border: `${rem(1)} solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[4]
        }`,
      }}
    >
      {!untitled && (
        <Title ta="center" my="md" order={3}>
          {metadata.title}
        </Title>
      )}

      {controlled && (
        <Flex align="center" mb="md">
          <Chip variant="filled" checked={false}>
            Фільтр:
          </Chip>
          {...controlled.map((c) =>
            c.value === undefined ? (
              <Chip checked={false}>{`оберіть [${
                metadata.annotations[c.column].title
              }]`}</Chip>
            ) : (
              <Chip checked={true}>{`[${
                metadata.annotations[c.column].title
              }] включає '${c.value}'`}</Chip>
            )
          )}
        </Flex>
      )}
      <Flex direction="row" justify="center" gap="md" m="xs">
        <TextInput
          w="100%"
          placeholder="Шукайте за полем сортування"
          icon={<IconSearch size="1.25rem" />}
          value={valueTyped}
          onChange={(e) => setValueTyped(e.currentTarget.value)}
          rightSection={
            valueTyped && (
              <ActionIcon onClick={() => setValueTyped("")}>
                <IconX size="1.25rem" />
              </ActionIcon>
            )
          }
        />
        {crudEnabled && (
          <Flex direction="row" align="stretch" justify="center" gap="md">
            <Modal
              closeButtonProps={{ size: "2.375rem" }}
              size="lg"
              opened={createOpened}
              onClose={createDisclosure.close}
              title={
                <Group>
                  <ThemeIcon
                    size={rem(36)}
                    variant="light"
                    color={dark ? undefined : "lime"}
                  >
                    <IconPlus />
                  </ThemeIcon>
                  Додавання запису у {metadata.title}
                </Group>
              }
            >
              <EntityForm<T>
                submit={Create}
                afterSubmit={() => createDisclosure.close()}
                entityRecord={metadata.default}
                metadata={metadata}
                controlled={controlled}
              />
            </Modal>
            <ActionIcon
              size={rem(36)}
              variant="light"
              title="Створити"
              color={dark ? undefined : "lime"}
              onClick={() => createDisclosure.open()}
            >
              <IconPlus />
            </ActionIcon>
            <Modal
              closeButtonProps={{ size: "2.375rem" }}
              size="lg"
              opened={editOpened}
              onClose={() => editDisclosure.close()}
              title={
                <Group>
                  <ThemeIcon
                    size={rem(36)}
                    variant="light"
                    color={dark ? undefined : "yellow"}
                  >
                    <IconEdit />
                  </ThemeIcon>
                  Редагування запису у {metadata.title}
                </Group>
              }
            >
              <EntityForm<T>
                submit={Update}
                afterSubmit={() => editDisclosure.close()}
                entityRecord={dataOne}
                metadata={metadata}
                controlled={controlled}
              />
            </Modal>
            {(singular
              ? singular.mod && singular.val
              : selection.length === 1) && (
              <ActionIcon
                size={rem(36)}
                variant="light"
                title="Редагувати"
                color={dark ? undefined : "yellow"}
                onClick={() => {
                  ReadOne(singular ? singular.val : selection[0]);
                  editDisclosure.open();
                }}
              >
                <IconEdit />
              </ActionIcon>
            )}
            <ActionIcon
              size={rem(36)}
              variant="light"
              title="Оновити"
              color={dark ? undefined : "blue"}
              onClick={() => ReadMany()}
            >
              <IconRefresh />
            </ActionIcon>
            <ActionIcon
              size={rem(36)}
              variant="light"
              title="Видалити"
              color={dark ? undefined : "red"}
              onClick={() =>
                Delete(
                  singular ? (singular.val ? [singular.val] : []) : selection
                )
              }
            >
              <IconTrash />
            </ActionIcon>
          </Flex>
        )}
      </Flex>

      <div style={{ overflow: "auto" }}>
        <Table sx={{ whiteSpace: "nowrap" }}>
          <thead>
            <tr>
              <th style={{ width: rem(40) }}>
                <Checkbox
                  onChange={() => toggleAll()}
                  checked={
                    singular
                      ? false
                      : selection.length !== 0 &&
                        selection.length === dataMany.length
                  }
                  indeterminate={
                    singular
                      ? singular.val !== undefined
                      : selection.length > 0 &&
                        selection.length !== dataMany.length
                  }
                />
              </th>
              {columns}
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <tr>
                <td colSpan={columns.length + 1}>
                  <Text weight={500} align="center">
                    Не знайдено
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <Pagination
        value={pageNo}
        onChange={setPageNo}
        total={searchPageCount === 1 ? 0 : searchPageCount}
        position="center"
        my="md"
        defaultValue={1}
      />
    </Paper>
  );
}
