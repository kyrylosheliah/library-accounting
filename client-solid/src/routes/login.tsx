import { Title } from "solid-start";
import { LoginForm } from "~/components/LoginForm";

export default function Login() {
  return (
    <>
      <Title>Вхід</Title>
      <main class="px-5 py-10 sm:py-20 flex items-center justify-center">
        <LoginForm />
      </main>
    </>
  );
}
