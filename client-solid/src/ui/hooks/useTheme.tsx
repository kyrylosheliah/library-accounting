import {
  Accessor,
  Component,
  JSX,
  Setter,
  createContext,
  createEffect,
  createSignal,
  onMount,
  useContext,
} from "solid-js";
import { SystemThemeValue, ThemeStoreValue } from "../Types";
import { isServer } from "solid-js/web";
import { useLocalStore } from "./useLocalStore";

export const PreferDarkColorScheme = () =>
  isServer ? false : window.matchMedia("(prefers-color-scheme: dark)").matches;

export interface ITheme {
  theme: Accessor<ThemeStoreValue>;
  systemTheme: Accessor<SystemThemeValue>;
  dark: Accessor<boolean>;
  toggleTheme: () => void;
  setLightPrimary: Setter<string>;
  setDarkPrimary: Setter<string>;
}

const ThemeContext = createContext<ITheme>({
  theme: () => "system" as ThemeStoreValue,
  systemTheme: () => "dark" as SystemThemeValue,
  dark: () => true,
  toggleTheme: () => {},
  setLightPrimary: () => {},
  setDarkPrimary: () => {},
});

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeContextProvider: Component<{
  children: JSX.Element;
  lightPrimaryColor?: string;
  darkPrimaryColor?: string;
}> = (props) => {
  const [lightPrimary, setLightPrimary] = createSignal<string>(
    props.lightPrimaryColor || "blue"
  );
  const [darkPrimary, setDarkPrimary] = createSignal<string>(
    props.darkPrimaryColor || "orange"
  );
  const [theme, setTheme] = useLocalStore<ThemeStoreValue>("theme", "system");
  const [systemTheme, setSystemTheme] = createSignal<SystemThemeValue>(
    PreferDarkColorScheme() ? "dark" : "light"
  );
  const [dark, setDark] = createSignal(true);

  if (!isServer) {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () =>
        setSystemTheme(PreferDarkColorScheme() ? "dark" : "light")
      );
  }

  const toggleTheme = () => {
    switch (theme()) {
      case "light":
        setTheme("dark");
        break;
      case "dark":
        setTheme("system");
        break;
      case "system":
        setTheme("light");
        break;
    }
  };

  // const ApplyLightTheme = () => {
  //   const doc = document.documentElement.style;
  //   const style = getComputedStyle(document.documentElement);
  //   doc.setProperty("--black", style.getPropertyValue(`--oc-black`));
  //   doc.setProperty("--white", style.getPropertyValue(`--oc-white`));
  //   for (let i = 9; i >= 0; --i) {
  //     doc.setProperty(
  //       `--variation-${i}`,
  //       style.getPropertyValue(`--oc-gray-${i}`)
  //     );
  //   }
  // };

  createEffect(() => {
    if (!isServer) {
      setDark(
        theme() === "system" ? systemTheme() === "dark" : theme() === "dark"
      );
      if (dark()) {
        document.documentElement.classList.remove(lightPrimary());
        document.documentElement.classList.add("dark", darkPrimary());
      } else {
        document.documentElement.classList.remove("dark", darkPrimary());
        document.documentElement.classList.add(lightPrimary());
      }
    }
  });

  return (
    <ThemeContext.Provider
      value={{
        theme: theme,
        systemTheme: systemTheme,
        dark: dark,
        toggleTheme: toggleTheme,
        setLightPrimary: setLightPrimary,
        setDarkPrimary: setDarkPrimary,
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};
