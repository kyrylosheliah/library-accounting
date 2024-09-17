import "@/globals.css";
import NextApp, { AppProps, AppContext } from "next/app";
import {
  AppShell,
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  useMantineTheme,
} from "@mantine/core";
import { HeaderMenu } from "root/components/HeaderMenu";
import { FooterMenu } from "root/components/FooterMenu";
import { ProvideAuth } from "root/hooks/useAuth";
import { Notifications } from "@mantine/notifications";
import { useState } from "react";
import Cookies from "js-cookie";

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const theme = useMantineTheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme
  );
  const dark = colorScheme === "dark";
  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (dark ? "light" : "dark");
    setColorScheme(nextColorScheme);
    Cookies.set("colorScheme", nextColorScheme.toString(), {
      expires: new Date(Date.now() + 300000000000),
      sameSite: "strict",
    });
  };

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme,
        primaryColor: dark ? "yellow" : "blue",
        primaryShade: 7,
        defaultRadius: "md",
      }}
    >
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <Notifications />
        <ProvideAuth>
          <AppShell
            bg={dark ? theme.colors.dark[9] : theme.white}
            header={<HeaderMenu />}
            footer={<FooterMenu />}
          >
            <Component {...pageProps} />
          </AppShell>
        </ProvideAuth>
      </ColorSchemeProvider>
    </MantineProvider>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    colorScheme: Cookies.get("colorScheme") || "light",
  };
};
