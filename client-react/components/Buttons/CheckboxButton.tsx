import { UnstyledButton, Text, createStyles, rem } from "@mantine/core";
import { useUncontrolled } from "@mantine/hooks";

const useStyles = createStyles((theme, { checked }: { checked: boolean }) => ({
  button: {
    textAlign: "center",
    height: "100%",
    width: "100%",
    transition: "background-color 100ms ease, border-color 100ms ease",
    border: `${rem(2)} solid ${
      checked
        ? theme.fn.variant({ variant: "outline", color: theme.primaryColor })
            .border
        : theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[3]
    }`,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    backgroundColor: checked
      ? theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .background
      : theme.colorScheme === "dark"
      ? theme.colors.dark[7]
      : theme.white,
  },

  body: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
}));

interface CheckboxButtonProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?(checked: boolean): void;
  title: string;
}

export function CheckboxButton({
  title,
  checked,
  onChange,
}: CheckboxButtonProps) {
  const [value, handleChange] = useUncontrolled({
    value: checked,
    defaultValue: false,
    finalValue: false,
    onChange,
  });
  const { classes } = useStyles({ checked: value });
  return (
    <UnstyledButton
      onClick={(e: any) => {
        e.stopPropagation();
        handleChange(!value);
      }}
      className={classes.button}
    >
      <Text>{title}</Text>
    </UnstyledButton>
  );
}
