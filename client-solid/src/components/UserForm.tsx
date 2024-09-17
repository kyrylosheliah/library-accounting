import axios from "axios";
import { useAuth } from "~/hooks/useAuth";
import { ToastError, ToastSuccess } from "./Toast";
import { EntityForm } from "./EntityForm";
import { FormFromUser, IUserForm, UserFormMetadata } from "~/models/User";

const BACKEND = import.meta.env.VITE_BACKEND;

export function UserForm() {
  const { user, assignUser } = useAuth();

  const submit = async (request: IUserForm) => {
    try {
      await axios.post(`${BACKEND}/user`, request, {
        withCredentials: true,
      });
      assignUser();
      ToastSuccess("Дані успішно змінено");
    } catch (error) {
      ToastError(`Помилка зміни даних\n${error}`);
    }
  };

  return (
    <EntityForm<IUserForm>
      submit={submit}
      record={() =>
        user() ? FormFromUser(user()!.record) : UserFormMetadata.default
      }
      metadata={UserFormMetadata}
    />
  );
}
