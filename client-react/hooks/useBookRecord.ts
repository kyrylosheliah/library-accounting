import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BookMetadata, IBook } from "root/models/Book";
import { IBookCategory } from "root/models/BookCategory";
import { useAuth } from "./useAuth";

export const useBookRecord = () => {
  const { query, isReady } = useRouter();
  const [categories, setCategories] = useState<IBookCategory[]>([]);
  const [book, setBook] = useState<IBook>(BookMetadata.default);
  const [quantity, setQuantity] = useState(0);
  const [wishes, setWishes] = useState(0);
  const { user } = useAuth();
  const [isWished, setIsWished] = useState(false);
  const [initiallyWished, setInitiallyWished] = useState(false);
  const localWishes =
    wishes +
    (initiallyWished === isWished ? 0 : isWished > initiallyWished ? 1 : -1);

  useEffect(() => {
    if (isReady) {
      getBook();
      getCategories();
    }
  }, [isReady]);

  useEffect(() => {
    if (user) {
      getWishStatus();
    }
  }, [user]);

  const getCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.BACKEND}/library/categories`
      );
      setCategories(response.data);
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Помилка завантаження категорій",
        message: (error as Error).toString(),
      });
    }
  };

  const getBook = async () => {
    try {
      const response = await axios.get(
        `${process.env.BACKEND}/library/book/${query.id}`
      );
      setBook(response.data.result);
      setQuantity(response.data.quantity);
      setWishes(response.data.wishes);
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Помилка завантаження книги",
        message: (error as Error).toString(),
      });
    }
  };

  const getWishStatus = async () => {
    if (!user) {
      return;
    }
    try {
      await axios.get(`${process.env.BACKEND}/user/wish/${query.id}`, {
        withCredentials: true,
      });
      setIsWished(true);
      setInitiallyWished(true);
    } catch (error) {
      setIsWished(false);
      setInitiallyWished(false);
    }
  };

  const wish = async () => {
    if (!user) {
      return;
    }
    try {
      await axios.post(
        `${process.env.BACKEND}/user/wish/${query.id}`,
        {},
        {
          withCredentials: true,
        }
      );
      setIsWished(true);
    } catch (error) {
      setIsWished(false);
    }
  };

  const unwish = async () => {
    if (!user) {
      return;
    }
    try {
      await axios.delete(`${process.env.BACKEND}/user/wish/${query.id}`, {
        withCredentials: true,
      });
      setIsWished(false);
    } catch (error) {}
  };

  return {
    isReady,
    categories,
    book,
    quantity,
    wishes: localWishes,
    wish: { isWished, initiallyWished, wish, unwish },
  };
};
