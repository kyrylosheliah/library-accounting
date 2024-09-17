import { notifications } from "@mantine/notifications";
import axios, { AxiosError } from "axios";

export const useBorrowAccounting = () => {
  const postBorrowDebt = async (borrowId: number) => {
    try {
      await axios.post(
        `${process.env.BACKEND}/librarian/debt/borrow/${borrowId}`,
        {},
        {
          withCredentials: true,
        }
      );
      notifications.show({
        color: "green",
        title: "Борг успішно зараховано",
        message: "",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Помилка зарахування боргу",
        message: (error as Error).toString(),
      });
    }
  };

  return postBorrowDebt;
};

export const useReturnAccounting = () => {
  const deleteDebtReturn = async (returnId: number) => {
    try {
      await axios.delete(
        `${process.env.BACKEND}/librarian/debt/return/${returnId}`,
        {
          withCredentials: true,
        }
      );
      notifications.show({
        color: "green",
        title: "Борг успішно списано",
        message: "",
      });
    } catch (error) {
      let response = (error as AxiosError).response;
      notifications.show({
        color: "red",
        title: "Помилка списання боргу",
        message: response ? (response.data as string) : "",
      });
    }
  };

  return deleteDebtReturn;
};

export const useSupplyAccounting = () => {
  const postShelfSupply = async (supplyId: number) => {
    try {
      await axios.post(
        `${process.env.BACKEND}/librarian/shelf/supply/${supplyId}`,
        {},
        {
          withCredentials: true,
        }
      );
      notifications.show({
        color: "green",
        title: "Успішно прораховано полиці для постачання",
        message: "",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Помилка прорахування полиць для постачання",
        message: (error as AxiosError).message,
      });
    }
  };

  return postShelfSupply;
};
