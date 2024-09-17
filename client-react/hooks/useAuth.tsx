import React, { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import decodeJwt from "root/helpers/decodeJwt";
import { notifications } from "@mantine/notifications";
import { IUser } from "root/models/User";

interface IAuthUser {
  record: IUser;
  avatar: any;
  decodedJwt: any;
}

interface IAuth {
  user: IAuthUser | undefined;
  hasClaim: (claim: string) => boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  assignUser: () => void;
}

const authContext = createContext<IAuth>({
  user: undefined,
  hasClaim: () => false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  assignUser: () => {},
});

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth(): IAuth {
  const [user, setUser] = useState<IAuthUser | undefined>(undefined);
  const router = useRouter();
  let token = Cookies.get("token");

  const loginCheck = () => {
    token = Cookies.get("token");
    if (!token) {
      setUser(undefined);
      return;
    }
    let decodedJwt: IAuthUser | undefined;
    if (!user) {
      decodedJwt = assignUser();
    }
    const payload = user ? user.decodedJwt : decodedJwt;
    if (!payload) {
      setUser(undefined);
      logout();
      return;
    }
    const now = new Date().getTime() / 1000;
    const expired = now >= payload.exp;
    if (expired) {
      setUser(undefined);
      logout();
      return;
    }
    const isExpiring = now >= payload.exp - (payload.exp - payload.nbf) / 4;
    if (isExpiring) {
      relogin();
    }
  };

  useEffect(() => {
    loginCheck();
    const reloginInterval = setInterval(loginCheck, 30000);
    return () => clearInterval(reloginInterval);
  }, [token, router.pathname, user]);

  const assignUser = () => {
    token = Cookies.get("token");
    if (!token) {
      setUser(undefined);
      return undefined;
    }
    const payload = decodeJwt(token);
    try {
      axios
        .get(`${process.env.BACKEND}/user`, { withCredentials: true })
        .then((response) => {
          response.data.user.DateOfBirth = response.data.user.DateOfBirth
            ? new Date(response.data.user.DateOfBirth)
            : null;
          response.data.user.RegisterDate = new Date(
            response.data.user.DateOfBirth
          );
          setUser({
            record: response.data.user,
            avatar: response.data.avatar,
            decodedJwt: payload,
          });
        });
      return payload;
    } catch (error) {
      setUser(undefined);
      return undefined;
    }
  };

  const handleRedirect = (route: string) => {
    const to = router.query.to;
    if (typeof to === "string") {
      router.push(new URL(to));
    } else {
      router.push(route);
    }
  };

  const hasClaim = (claim: string): boolean => {
    const payload = user?.decodedJwt;
    if (!payload) {
      return false;
    }
    const claimValue = payload[claim];
    if (!claimValue) {
      return false;
    }
    return claimValue === "true";
  };

  const login = async (email: string, password: string) => {
    try {
      await axios.post(
        `${process.env.BACKEND}/auth/login`,
        { email: email, password: password },
        { withCredentials: true }
      );
      assignUser();
      handleRedirect("/");
      notifications.show({
        color: "green",
        title: "Вхід успішний",
        message: "Ви авторизовані обліковим записом",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Помилка входу",
        message: (error as Error).toString(),
      });
    }
  };

  const relogin = async () => {
    try {
      await axios.post(
        `${process.env.BACKEND}/auth/relogin`,
        {},
        { withCredentials: true }
      );
      assignUser();
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Помилка входу без паролю через кукі",
        message: (error as Error).toString(),
      });
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await axios.post(
        `${process.env.BACKEND}/auth/register`,
        {
          name: name,
          email: email,
          password: password,
        },
        { withCredentials: true }
      );
      handleRedirect("/login");
      notifications.show({
        color: "green",
        title: "Реєстрація успішна",
        message: "Тепер існує новий користувач",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Помилка реєстрації",
        message: (error as Error).toString(),
      });
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${process.env.BACKEND}/auth/logout`,
        {},
        { withCredentials: true }
      );
      setUser(undefined);
      notifications.show({
        color: "green",
        title: "Вихід 👽",
        message: "Ви більше не маєте наших кукі",
      });
      handleRedirect("/");
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Помилка виходу",
        message: (error as Error).toString(),
      });
    }
  };

  return {
    user,
    hasClaim,
    login,
    register,
    logout,
    assignUser,
  };
}

export function ProvideAuth({ children }: any) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
