import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useEffect, useState } from "react";
import { IMembership } from "root/models/Membership";

export function useMembership() {
  const [membership, setMembership] = useState<IMembership | undefined>(
    undefined
  );

  useEffect(() => {
    getMembership();
  }, []);

  const getMembership = async () => {
    try {
      const response = await axios.get(
        `${process.env.BACKEND}/user/membership`,
        {
          withCredentials: true,
        }
      );
      response.data.StartDate = new Date(response.data.StartDate);
      response.data.ExpirationDate = new Date(response.data.ExpirationDate);
      setMembership(response.data);
    } catch (error) {
      setMembership(undefined);
    }
  };

  const submit = async (request: any) => {
    try {
      await axios.post(
        `${process.env.BACKEND}/user/membership/transaction`,
        request,
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          withCredentials: true,
        }
      );
      getMembership();
      notifications.show({
        color: "green",
        title: "Транзакція членства успішно виконана",
        message: "",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Помилка виконання транзакції членства",
        message: (error as Error).toString(),
      });
    }
  };

  return { membership, submit };
}
