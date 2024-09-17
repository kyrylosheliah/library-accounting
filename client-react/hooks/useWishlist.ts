import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useState, useEffect } from "react";
import { IBook } from "root/models/Book";

interface IWishInstance {
  Id: number;
  Book?: IBook;
  BookCategory: string | null;
}

export const useWishlist = () => {
  const [ready, setReady] = useState(false);
  const [success, setSuccess] = useState(true);
  const [wishlist, setWishlist] = useState<IWishInstance[]>([]);

  useEffect(() => {
    getWishlist();
  }, []);

  const getWishlist = async () => {
    try {
      const response = await axios.get(`${process.env.BACKEND}/user/wishes`, {
        withCredentials: true,
      });
      setWishlist(response.data);
      setReady(true);
      setSuccess(true);
    } catch (error) {
      setWishlist([]);
      setSuccess(false);
      notifications.show({
        color: "red",
        title: "Помилка завантаження списку бажаного",
        message: (error as Error).toString(),
      });
    }
  };

  const unwish = async (index: number) => {
    const bookId = wishlist[index].Book?.Id;
    if (!bookId) {
      return;
    }
    try {
      await axios.delete(`${process.env.BACKEND}/user/wish/${bookId}`, {
        withCredentials: true,
      });
      getWishlist();
    } catch (error) {}
  };

  return {
    ready,
    success,
    wishlist,
    unwish,
  };
};
