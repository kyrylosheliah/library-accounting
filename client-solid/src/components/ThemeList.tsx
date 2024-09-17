import { useTheme } from "~/ui/hooks/useTheme";
import { Text } from "~/ui/components/Text";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "~/ui/components/Button";

export const ThemeList = () => {
  const { theme } = useTheme();

  return (
    <div>
      <Text>Current theme:</Text>
      <Text>{theme()}</Text>
      <ThemeToggle />
      <br />
      <br />
      <Text>Current css variables:</Text>
      {/* <For>

      </For> */}
      <Text>123</Text>
      <Button>get</Button>
    </div>
  );
};
