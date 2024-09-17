import { Center, Loader, rem, Text } from "@mantine/core";

export const LoadingListWrapper = ({
  success,
  ready,
  items,
}: {
  success: boolean;
  ready: boolean;
  items: any;
}) =>
  success ? (
    ready ? (
      items.length ? (
        items
      ) : (
        <Center mt={rem(50)}>
          <Text>Пусто</Text>
        </Center>
      )
    ) : (
      <Center mt={rem(50)}>
        <Loader />
      </Center>
    )
  ) : (
    <Center mt={rem(50)}>
      <Text c="red">Помилка</Text>
    </Center>
  );

export const LoadingWrapper = ({
  success,
  ready,
  item,
  length,
}: {
  success: boolean;
  ready: boolean;
  item: JSX.Element;
  length: number;
}) =>
  success ? (
    ready ? (
      length ? (
        item
      ) : (
        <Center mt={rem(50)}>
          <Text>Пусто</Text>
        </Center>
      )
    ) : (
      <Center mt={rem(50)}>
        <Loader />
      </Center>
    )
  ) : (
    <Center mt={rem(50)}>
      <Text c="red">Помилка</Text>
    </Center>
  );
