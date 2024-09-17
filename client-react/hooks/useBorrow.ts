import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useEffect, useState } from "react";
import { IBook } from "root/models/Book";

interface BorrowPosition {
  BorrowItemId: number;
  Book: IBook | null;
  BookCategory: string | null;
  Quantity: number;
  ExpirationDate: Date;
}

export interface BorrowInstance {
  BorrowId: number;
  StaffId: number;
  ReaderId: number;
  BorrowDate: Date;
  Cart: BorrowPosition[] | null;
}

interface ReturnPosition {
  ReturnItemId: number;
  Book: IBook | null;
  BookCategory: string | null;
  Quantity: number;
}

export interface ReturnInstance {
  ReturnId: number;
  StaffId: number;
  ReaderId: number;
  ReturnDate: Date;
  Cart: ReturnPosition[] | null;
}

export const useBorrows = () => {
  const [borrowsReady, setBorrowsReady] = useState(false);
  const [borrowsSuccess, setBorrowsSuccess] = useState(true);
  const [borrows, setBorrows] = useState<BorrowInstance[]>([]);

  const [returnsReady, setReturnsReady] = useState(false);
  const [returnsSuccess, setReturnsSuccess] = useState(true);
  const [returns, setReturns] = useState<ReturnInstance[]>([]);

  useEffect(() => {
    getBorrows();
    getReturns();
  }, []);

  const getBorrows = async () => {
    try {
      const response = await axios.get(`${process.env.BACKEND}/user/borrows`, {
        withCredentials: true,
      });
      (response.data as BorrowInstance[]).forEach((borrowInstance) => {
        borrowInstance.BorrowDate = new Date(borrowInstance.BorrowDate);
        if (!borrowInstance.Cart) {
          return;
        }
        borrowInstance.Cart.forEach((cartItem) => {
          cartItem.ExpirationDate = new Date(cartItem.ExpirationDate);
        });
      });
      setBorrows(response.data);
      setBorrowsReady(true);
      setBorrowsSuccess(true);
    } catch (error) {
      setBorrows([]);
      setBorrowsSuccess(false);
      notifications.show({
        color: "red",
        title: "Помилка завантаження запозичень",
        message: (error as Error).toString(),
      });
    }
  };

  const getReturns = async () => {
    try {
      const response = await axios.get(`${process.env.BACKEND}/user/returns`, {
        withCredentials: true,
      });
      (response.data as ReturnInstance[]).forEach((returnInstance) => {
        returnInstance.ReturnDate = new Date(returnInstance.ReturnDate);
      });
      setReturns(response.data);
      setReturnsReady(true);
      setReturnsSuccess(true);
    } catch (error) {
      setReturns([]);
      setReturnsSuccess(false);
      notifications.show({
        color: "red",
        title: "Помилка завантаження повернень",
        message: (error as Error).toString(),
      });
    }
  };

  return {
    borrowsReady,
    borrowsSuccess,
    borrows,
    returnsReady,
    returnsSuccess,
    returns,
  };
};
