import { IconButton } from "~/ui/components/IconButton";
import { useTheme } from "~/ui/hooks/useTheme";

export const ThemeToggle = () => {
  const { theme, dark, toggleTheme } = useTheme();
  return (
    <IconButton
      variant="outline"
      size="md"
      icon={
        theme() === "system"
          ? "i-tabler-sun-moon"
          : dark()
          ? "i-tabler-moon"
          : "i-tabler-sun"
      }
      attributes={{
        title:
          theme() === "system"
            ? "Системна тема"
            : dark()
            ? "Темна тема"
            : "Світла тема",
        onClick: () => toggleTheme(),
      }}
    />
  );
};
