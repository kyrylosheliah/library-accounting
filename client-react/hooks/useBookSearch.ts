import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BookSearchFilterPurpose, IBook } from "root/models/Book";
import { IBookCategory } from "root/models/BookCategory";

export const useBookSearch = () => {
  const pageSize = 8;
  const [categories, setCategories] = useState<IBookCategory[]>([]);
  const [ascending, toggleAscending] = useToggle([true, false] as const);
  const [orderByColumn, setOrderByColumn] = useState<string>("Id");
  const [searchData, setSearchData] = useState<IBook[]>();
  const [searchPageCount, setSearchPageCount] = useState(0);
  const [categoryChecked, setCategoryChecked] = useState(0);
  const [keyChecked, setKeyChecked] = useState(0);
  const [valueTyped, setValueTyped] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const router = useRouter();

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    parseQuery();
    getSearch();
  }, [router.asPath]);

  useEffect(() => {
    getSearch();
  }, [pageNo]);

  const getCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.BACKEND}/library/categories`
      );
      const categoriesResponse: IBookCategory[] = [{ Id: 0, Category: "-" }];
      setCategories(categoriesResponse.concat(response.data));
      notifications.show({
        color: "green",
        title: "Отримано категорії",
        message: `Можна вибирати з ${categoriesResponse.length} категорій`,
      });
      parseQuery();
    } catch (error) {
      setCategories([{ Id: -1, Category: "Усі книги" }]);
    }
  };

  const setQuery = () => {
    const categoryParsed = categories[categoryChecked].Id;
    const keyParsed = BookSearchFilterPurpose[keyChecked].key;
    var obj: any = new Object();
    if (categoryParsed) {
      obj.CategoryId = categoryParsed;
    }
    if (keyParsed && valueTyped) {
      obj[keyParsed] = valueTyped;
    }
    router.push(
      {
        pathname: router.pathname,
        query: obj,
      },
      undefined,
      { shallow: true }
    );
    setPageNo(1);
  };

  const parseQuery = () => {
    let categoryId: number | undefined;
    let keyParam: string | undefined;
    let valueParam: string | undefined;
    for (const [key, value] of Object.entries(router.query)) {
      if (key === "CategoryId") {
        const parsed = parseInt(value?.toString() || "");
        categoryId = !isNaN(parsed) ? parsed : undefined;
      } else {
        keyParam = key;
        valueParam = value?.toString();
      }
    }
    setCategoryChecked(
      categoryId ? categories.findIndex((c) => c.Id === categoryId) : 0
    );
    setKeyChecked(
      BookSearchFilterPurpose.findIndex((i) => i.key === keyParam) || 0
    );
    setValueTyped(valueParam || "");
  };

  const getSearchObj = () => {
    var obj: any = new Object();
    obj.ascending = ascending;
    obj.orderByColumn = orderByColumn;
    obj.pageSize = pageSize;
    obj.pageNo = pageNo;
    obj.criterias = new Array<Object>();
    for (const [key, value] of Object.entries(router.query)) {
      if (value) {
        obj.criterias.push({ column: key, value: value.toString() });
      }
    }
    return obj;
  };

  const getSearch = async () => {
    try {
      const response = await axios.post(
        `${process.env.BACKEND}/library/search`,
        getSearchObj()
      );
      setSearchData(response.data.result);
      setSearchPageCount(response.data.pageCount);
      notifications.show({
        color: "green",
        title: `Знайдено сторінок: ${response.data.pageCount}`,
        message: "",
      });
    } catch (error) {
      setSearchData(undefined);
      setSearchPageCount(0);
    }
  };

  return {
    categories,
    searchData,
    searchPageCount,
    page: { pageNo, setPageNo },
    ascending: { ascending, toggleAscending },
    queryFields: {
      categoryChecked,
      setCategoryChecked,
      keyChecked,
      setKeyChecked,
      valueTyped,
      setValueTyped,
    },
    setOrderByColumn,
    setQuery,
    getSearch,
  };
};
