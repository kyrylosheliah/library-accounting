import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useEffect, useState } from "react";
import { IBook } from "root/models/Book";

export interface IDebtInstance {
  BorrowItemId: number;
  BorrowDate: Date;
  Book: IBook | null;
  BookCategory: string | null;
  Quantity: number;
  ExpirationDate: Date;
}

export const useDebts = () => {
  const [ready, setReady] = useState(false);
  const [success, setSuccess] = useState(true);
  const [debts, setDebts] = useState<IDebtInstance[]>([]);

  useEffect(() => {
    getDebts();
  }, []);

  const getDebts = async () => {
    try {
      const response = await axios.get(`${process.env.BACKEND}/user/debts`, {
        withCredentials: true,
      });
      (response.data as IDebtInstance[]).forEach((debt) => {
        debt.BorrowDate = new Date(debt.BorrowDate);
        debt.ExpirationDate = new Date(debt.ExpirationDate);
      });
      setDebts(response.data);
      setReady(true);
      setSuccess(true);
    } catch (error) {
      setDebts([]);
      setSuccess(false);
      notifications.show({
        color: "red",
        title: "Помилка завантаження боргів",
        message: (error as Error).toString(),
      });
    }
  };

  return {
    ready,
    success,
    debts,
  };
};
