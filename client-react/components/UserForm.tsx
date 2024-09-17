import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useAuth } from "root/hooks/useAuth";
import { FormFromUser, IUserForm, UserFormMetadata } from "root/models/User";
import { EntityForm } from "./EntityForm";

export function UserForm() {
  const { user, assignUser } = useAuth();

  const submit = async (request: any) => {
    try {
      await axios.post(`${process.env.BACKEND}/user`, request, {
        withCredentials: true,
      });
      assignUser();
      notifications.show({
        color: "green",
        title: "Дані успішно змінено",
        message: "",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Помилка зміни даних",
        message: (error as Error).toString(),
      });
    }
  };

  return (
    <EntityForm<IUserForm>
      submit={submit}
      afterSubmit={() => {}}
      entityRecord={user ? FormFromUser(user.record) : UserFormMetadata.default}
      metadata={UserFormMetadata}
      controlled={undefined}
    />
  );
}
