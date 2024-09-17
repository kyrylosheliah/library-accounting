// @refresh reload
import "@unocss/reset/tailwind.css";
import "./root.variables.css";
import "./root.css";
import "virtual:uno.css";
import {
  Body,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
} from "solid-start";
import { Header } from "~/components/Header";
import { Toaster } from "solid-toast";
import { AuthContextProvider } from "./hooks/useAuth";
import { ThemeContextProvider, useTheme } from "./ui/hooks/useTheme";
import { Footer } from "./components/Footer";
import { cx } from "./ui/utils/cx";
import { onMount } from "solid-js";

export default function Root() {
  let html: HTMLHtmlElement;
  onMount(() => {
    html.classList.remove("black");
  });
  const { dark } = useTheme();
  return (
    <Html ref={html!} lang="en" class={cx("black", dark() && "dark")}>
      <Head>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body class="body">
        <AuthContextProvider>
          <ThemeContextProvider>
            <div class="min-h-screen">
              <Header />
              <Routes>
                <FileRoutes />
              </Routes>
            </div>
            <Footer />
            <Scripts />
            <Toaster position="bottom-right" />
          </ThemeContextProvider>
        </AuthContextProvider>
      </Body>
    </Html>
  );
}
