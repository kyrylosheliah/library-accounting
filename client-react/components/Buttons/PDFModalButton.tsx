import React, { useRef } from "react";
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useReactToPrint } from "react-to-print";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowLeft, IconPrinter } from "@tabler/icons-react";

export function PDFModalButton({
  text,
  DocumentComponent,
  parameter,
}: {
  text: any;
  DocumentComponent: any;
  parameter: any;
}) {
  const theme = useMantineTheme();
  const [opened, disclosure] = useDisclosure(false);
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <Modal
        closeButtonProps={{ size: "2.375rem" }}
        size="lg"
        opened={opened}
        onClose={disclosure.close}
        title={
          <Group>
            <ActionIcon
              size={rem(36)}
              variant="subtle"
              color={theme.colors[theme.primaryColor][6]}
              onClick={() => handlePrint()}
            >
              <IconPrinter />
            </ActionIcon>
            <IconArrowLeft />
            Роздрукувати чек
          </Group>
        }
      >
        <div ref={componentRef}>
          <DocumentComponent parameter={parameter} />
        </div>
      </Modal>
      <Button compact variant="subtle" onClick={() => disclosure.open()}>
        {text}
      </Button>
    </>
  );
}
