import { Title } from "solid-start";
import { RegisterForm } from "~/components/RegisterForm";

export default function Register() {
  return (
    <>
      <Title>Реєстрація</Title>
      <main class="px-5 py-10 sm:py-20 flex items-center justify-center">
        <RegisterForm />
      </main>
    </>
  );
}
