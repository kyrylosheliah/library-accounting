import axios from "axios";
import dayjs from "dayjs";
import { Accessor, createEffect, createSignal, on } from "solid-js";
import { ToastError, ToastSuccess } from "~/components/Toast";
import { useDebounce } from "~/ui/hooks/useDebounce";

const BACKEND = import.meta.env.VITE_BACKEND;

const InterceptResponse = (data: any) => {
  for (const key of Object.keys(data)) {
    const value = (data as any)[key];
    if (value === null) {
      continue;
    }
    const lower = key.toLowerCase();
    if (
      lower.includes("date") ||
      lower.includes("created") ||
      lower.includes("modified")
    ) {
      (data as any)[key] = dayjs(value).format("YYYY-MM-DDTHH:mm:ss.SSS");
    }
    if (key.includes("Hash")) {
      (data as any)[key] = "";
    }
  }
};

const InterceptRequest = (data: any) => {
  for (const key of Object.keys(data)) {
    const value = (data as any)[key];
    if (value === null) {
      continue;
    }
    const lower = key.toLowerCase();
    if (
      lower.includes("date") ||
      lower.includes("created") ||
      lower.includes("modified")
    ) {
      (data as any)[key] = dayjs(value).toISOString();
    }
  }
};

export type ControlledFields<T> = Array<{ column: keyof T; value: any }>;

export const useCRUD = <T>(
  endpoints: { one: string; many: string },
  controlled?: Accessor<ControlledFields<T>>
) => {
  const [dataOne, setDataOne] = createSignal<T>({} as any);
  const [dataMany, setDataMany] = createSignal<Array<T>>([]);
  const pageSize = 10;
  const [ascending, setAscending] = createSignal<boolean>(false);
  const [orderByColumn, setOrderByColumn] = createSignal<keyof T>(
    "Id" as keyof T
  );
  const [searchPageCount, setSearchPageCount] = createSignal(0);
  const [valueTyped, setValueTyped] = createSignal("");
  const debouncedValueTyped = useDebounce(valueTyped, 1000);
  const [pageNo, setPageNo] = createSignal(1);

  const Create = async (request: T) => {
    try {
      InterceptRequest(request);
      const response = await axios.post(`${BACKEND}${endpoints.one}`, request, {
        withCredentials: true,
      });
      setDataOne(() => ({} as T));
      setOrderByColumn(() => "Id" as keyof T);
      ToastSuccess(`Створення успішне\nId: ${response.data.Id}`);
      ReadMany();
    } catch (error) {
      ToastError(`Помилка створення запису\n${error}`);
    }
  };

  const ReadOne = async (request: number, fallback: T) => {
    if (request === -1) {
      setDataOne(() => fallback);
      return;
    }
    try {
      let response = await axios.get(`${BACKEND}${endpoints.one}/${request}`, {
        withCredentials: true,
      });
      InterceptResponse(response.data);
      setDataOne(response.data);
    } catch (error) {
      setDataOne(() => fallback);
      ToastError(`Помилка отримання запису\n${error}`);
    }
  };

  const ReadMany = async () => {
    try {
      const stringifiedOrEmptyControlled = controlled
        ? controlled().map((item) =>
            item.value
              ? {
                  column: item.column,
                  value: item.value.toString(),
                }
              : {}
          )
        : [];
      const response = await axios.post(
        `${BACKEND}${endpoints.many}`,
        {
          ascending: ascending(),
          orderByColumn: orderByColumn(),
          pageSize: pageSize,
          pageNo: pageNo(),
          criterias: [
            ...stringifiedOrEmptyControlled,
            { column: orderByColumn(), value: valueTyped() },
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
      ToastError(`Помилка отримання списку\n${error}`);
    }
  };

  const Update = async (request: T) => {
    InterceptRequest(request);
    try {
      await axios.put(`${BACKEND}${endpoints.one}`, request, {
        withCredentials: true,
      });
      ToastSuccess(`Редагування успішне\n${(request as any).Id}`);
      setDataOne({} as any);
      ReadMany();
    } catch (error) {
      ToastError(`Помилка редагування запису\n${error}`);
    }
  };

  const Delete = async (request: any[]) => {
    try {
      for (const item of request) {
        await axios.delete(`${BACKEND}${endpoints.one}/${item}`, {
          withCredentials: true,
        });
      }
      ToastSuccess(`Видалення успішне\nЗаторкнуто записів: ${request.length}`);
      ReadMany();
    } catch (error) {
      ToastError(`Помилка видалення записів\n${error}`);
    }
  };

  createEffect(
    on(
      [
        ascending,
        orderByColumn,
        pageNo,
        debouncedValueTyped,
        controlled ? controlled : () => [],
      ],
      ReadMany
    )
  );

  createEffect(
    on(searchPageCount, () => {
      if (searchPageCount && pageNo > searchPageCount) {
        setPageNo(searchPageCount() || 1);
      }
    })
  );

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
