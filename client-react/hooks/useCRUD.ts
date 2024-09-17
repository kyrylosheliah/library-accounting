import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useEffect, useState } from "react";

export const useCRUD = <T>(
  endpoints: { one: string; many: string },
  controlled: { column: string; value: any }[] | undefined
) => {
  const [dataOne, setDataOne] = useState<T>({} as any);
  const [dataMany, setDataMany] = useState<T[]>([]);
  const pageSize = 10;
  const [ascending, setAscending] = useState<boolean>(false);
  const [orderByColumn, setOrderByColumn] = useState<string>("Id");
  const [searchPageCount, setSearchPageCount] = useState(0);
  const [valueTyped, setValueTyped] = useState("");
  const [debouncedValueTyped] = useDebouncedValue(valueTyped, 1000);
  const [pageNo, setPageNo] = useState(1);

  useEffect(() => {
    ReadMany();
  }, [ascending, orderByColumn, pageNo, debouncedValueTyped, controlled]);

  useEffect(() => {
    if (searchPageCount && pageNo > searchPageCount) {
      setPageNo(searchPageCount);
    }
  }, [searchPageCount]);

  const Create = async (request: T) => {
    try {
      const response = await axios.post(
        `${process.env.BACKEND}${endpoints.one}`,
        request,
        {
          withCredentials: true,
        }
      );
      setDataOne({} as any);
      setOrderByColumn("Id");
      setValueTyped(
        typeof response.data.Id === "string"
          ? response.data.Id
          : response.data.Id.toString()
      );
      notifications.show({
        color: "green",
        title: "Створення успішне ",
        message: "",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Помилка створення запису",
        message: (error as Error).toString(),
      });
    }
  };

  const ReadOne = async (request: number) => {
    setDataOne({} as any);
    try {
      let response = await axios.get(
        `${process.env.BACKEND}${endpoints.one}/${request}`,
        {
          withCredentials: true,
        }
      );
      for (const [key, _] of Object.entries(response.data)) {
        let value = (response.data as any)[key];
        if (value === null) {
          continue;
        }
        let lower = key.toLowerCase();
        if (
          lower.includes("date") ||
          lower.includes("created") ||
          lower.includes("modified")
        ) {
          (response.data as any)[key] = new Date(value);
        }
        if (lower.includes("hash")) {
          (response.data as any)[key] = "";
        }
      }
      setDataOne(response.data);
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Помилка отримання запису",
        message: (error as Error).toString(),
      });
    }
  };

  const ReadMany = async () => {
    try {
      const stringifiedOrEmptyControlled = controlled
        ? controlled.map((item) =>
            item.value
              ? {
                  column: item.column,
                  value: item.value.toString(),
                }
              : {}
          )
        : [];
      const response = await axios.post(
        `${process.env.BACKEND}${endpoints.many}`,
        {
          ascending: ascending,
          orderByColumn: orderByColumn,
          pageSize: pageSize,
          pageNo: pageNo,
          criterias: [
            ...stringifiedOrEmptyControlled,
            { column: orderByColumn, value: valueTyped },
          ],
        },
        {
          withCredentials: true,
        }
      );
      setDataMany(response.data.result);
      setSearchPageCount(response.data.pageCount);
    } catch (error) {
      setDataMany([]);
      notifications.show({
        color: "red",
        title: "Помилка отримання списку",
        message: (error as Error).toString(),
      });
    }
  };

  const Update = async (request: T) => {
    try {
      await axios.put(`${process.env.BACKEND}${endpoints.one}`, request, {
        withCredentials: true,
      });
      notifications.show({
        color: "green",
        title: "Редагування успішне",
        message: `Запис ${(request as any).Id} змінено`,
      });
      setDataOne({} as any);
      ReadMany();
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Помилка редагування запису",
        message: (error as Error).toString(),
      });
    }
  };

  const Delete = async (request: any[]) => {
    try {
      for (const item of request) {
        await axios.delete(`${process.env.BACKEND}${endpoints.one}/${item}`, {
          withCredentials: true,
        });
      }
      notifications.show({
        color: "green",
        title: "Видалення успішне",
        message: `Заторкнуто записів: ${request.length}`,
      });
      ReadMany();
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Помилка видалення запис(у,ів)",
        message: (error as Error).toString(),
      });
    }
  };

  return {
    dataOne,
    dataMany,
    Create,
    ReadOne,
    ReadMany,
    Update,
    Delete,
    searchPageCount,
    page: { pageNo, setPageNo },
    ascending: { ascending, setAscending },
    queryFields: {
      orderByColumn,
      setOrderByColumn,
      valueTyped,
      setValueTyped,
    },
  };
};
