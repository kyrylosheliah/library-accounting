import { Box, Flex, Table, Text, Title, createStyles } from "@mantine/core";
import { BorrowInstance } from "root/hooks/useBorrow";
import { libraryContacts } from "./LibraryContacts";

const useStyles = createStyles((theme) => ({
  wrapper: {
    "&, & *": {
      color: `${theme.black} !important`,
      background: theme.white,
    },
  },
}));

export const BorrowInvoice = ({ parameter }: { parameter: BorrowInstance }) => {
  const { classes } = useStyles();
  return (
    <div className={classes.wrapper}>
      <Title mb="xl" align="center">
        Кошик запозичення
      </Title>
      <Title order={2}>Бібліотека</Title>
      <Flex my="xl" direction="row" justify="space-between" align="flex-start">
        <Box w="100%">
          <Text>{libraryContacts.email}</Text>
          <Text>{libraryContacts.address}</Text>
          <Text>{libraryContacts.phone}</Text>
        </Box>
        <Table withBorder style={{ tableLayout: "fixed" }}>
          <tr>
            <th>Код кошика</th>
            <td align="center">{parameter.BorrowId}</td>
          </tr>
          <tr>
            <th>Код бібліотекаря</th>
            <td align="center">{parameter.StaffId}</td>
          </tr>
          <tr>
            <th>Код читача</th>
            <td align="center">{parameter.ReaderId}</td>
          </tr>
          <tr>
            <th>Дата запозичення</th>
            <td align="center">{parameter.BorrowDate.toLocaleString()}</td>
          </tr>
        </Table>
      </Flex>
      <Table withBorder withColumnBorders>
        <thead>
          <tr>
            <th>Код</th>
            <th>Кількість</th>
            <th>Спливає</th>
            <th>Код книги</th>
            <th>ISBN</th>
            <th>Назва</th>
          </tr>
        </thead>
        <tbody>
          {parameter.Cart ? (
            parameter.Cart.map((cartItem, index) => (
              <tr key={index}>
                <td>{cartItem.BorrowItemId}</td>
                <td>{cartItem.Quantity}</td>
                <td>{cartItem.ExpirationDate.toLocaleString()}</td>
                <td>{cartItem.Book?.Id}</td>
                <td>{cartItem.Book?.Isbn}</td>
                <td>{cartItem.Book?.Title}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>Пусто</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};
