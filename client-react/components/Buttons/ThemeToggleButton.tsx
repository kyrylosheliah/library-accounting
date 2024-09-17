import {
  ActionIcon,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconBook, IconBook2 } from "@tabler/icons-react";

export const ThemeToggleButton = () => {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  return (
    <ActionIcon
      size="2.375rem"
      variant="outline"
      color={theme.fn.primaryColor()}
      onClick={() => toggleColorScheme()}
      title="Переключення кольорової схеми"
    >
      {dark ? <IconBook2 /> : <IconBook />}
    </ActionIcon>
  );
};
