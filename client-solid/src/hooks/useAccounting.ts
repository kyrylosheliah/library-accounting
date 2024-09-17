import axios, { AxiosError } from "axios";
import { ToastError, ToastSuccess } from "~/components/Toast";

const BACKEND = import.meta.env.VITE_BACKEND;

export const useBorrowAccounting = () => {
  const postBorrowDebt = async (borrowId: number) => {
    try {
      await axios.post(
        `${BACKEND}/librarian/debt/borrow/${borrowId}`,
        {},
        {
          withCredentials: true,
        }
      );
      ToastSuccess("Борг успішно зараховано");
    } catch (error) {
      ToastError(`Помилка зарахування боргу\n${error}`);
    }
  };
  return postBorrowDebt;
};

export const useReturnAccounting = () => {
  const deleteDebtReturn = async (returnId: number) => {
    try {
      await axios.delete(`${BACKEND}/librarian/debt/return/${returnId}`, {
        withCredentials: true,
      });
      ToastSuccess("Борг успішно списано");
    } catch (error) {
      let response = (error as AxiosError).response;
      ToastError(`Помилка списання боргу\n${response ? response.data : error}`);
    }
  };

  return deleteDebtReturn;
};

export const useSupplyAccounting = () => {
  const postShelfSupply = async (supplyId: number) => {
    try {
      await axios.post(
        `${BACKEND}/librarian/shelf/supply/${supplyId}`,
        {},
        {
          withCredentials: true,
        }
      );
      ToastSuccess("Успішно прораховано полиці для постачання");
    } catch (error) {
      ToastError(`Помилка прорахування полиць для постачання\n${error}`);
    }
  };

  return postShelfSupply;
};
