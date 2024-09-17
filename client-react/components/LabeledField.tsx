import { Flex, Input, Text, rem } from "@mantine/core";

export const LabeledField = ({
  label,
  description = "",
  size = 18,
  icon = undefined,
  value,
}: {
  label: string;
  description?: string;
  size?: number;
  icon?: any;
  value: any;
}) => {
  const field = (
    <Input.Wrapper
      label={label}
      description={description}
      size={rem((size / 8) * 5)}
      pl={icon ? rem(8) : undefined}
    >
      <Text size={rem(size)}>{value}</Text>
    </Input.Wrapper>
  );
  return (
    <Flex align="center" p={rem(4)}>
      {icon && icon}
      {field}
    </Flex>
  );
};
