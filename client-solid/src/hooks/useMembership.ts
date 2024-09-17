import axios from "axios";
import { createSignal, onMount } from "solid-js";
import { ToastError, ToastSuccess } from "~/components/Toast";
import { IMembership } from "~/models/Membership";

const BACKEND = import.meta.env.VITE_BACKEND;

export function useMembership() {
  const [membership, setMembership] = createSignal<IMembership | undefined>(
    undefined
  );

  const getMembership = async () => {
    try {
      const response = await axios.get(`${BACKEND}/user/membership`, {
        withCredentials: true,
      });
      response.data.StartDate = new Date(response.data.StartDate);
      response.data.ExpirationDate = new Date(response.data.ExpirationDate);
      setMembership(response.data);
    } catch (error) {
      setMembership(undefined);
    }
  };

  const submit = async (request: any) => {
    try {
      await axios.post(`${BACKEND}/user/membership/transaction`, request, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        withCredentials: true,
      });
      getMembership();
      ToastSuccess("Транзакція членства успішно виконана");
    } catch (error) {
      ToastError(`Помилка виконання транзакції членства\n${error}`);
    }
  };

  onMount(getMembership);

  return { membership, submit };
}
