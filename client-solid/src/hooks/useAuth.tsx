import axios from "axios";
import Cookies from "js-cookie";
import {
  Accessor,
  Component,
  JSX,
  createContext,
  createEffect,
  createSignal,
  on,
  useContext,
} from "solid-js";
import { useLocation, useNavigate } from "solid-start";
import { ToastError, ToastSuccess } from "~/components/Toast";
import { IUser } from "~/models/User";
import decodeJwt from "~/utils/decodeJwt";

const BACKEND = import.meta.env.VITE_BACKEND;

export interface IAuthUser {
  record: IUser;
  avatar: any;
  decodedJwt: any;
}
export interface IAuth {
  user: Accessor<IAuthUser | undefined>;
  hasClaim: (claim: string | undefined) => boolean;
  login: (params: { email: string; password: string }) => Promise<void>;
  register: (params: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  assignUser: () => void;
}

const AuthContext = createContext<IAuth>({
  user: () => undefined,
  hasClaim: () => false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  assignUser: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider: Component<{ children: JSX.Element }> = (
  props
) => {
  const [user, setUser] = createSignal<IAuthUser | undefined>(undefined);
  const location = useLocation();
  const navigate = useNavigate();
  const token = () => Cookies.get("token");

  const loginRoutine = () => {
    if (!token()) {
      setUser(undefined);
      return;
    }
    let decodedJwt: IAuthUser | undefined;
    const curUser = user();
    if (!curUser) {
      decodedJwt = assignUser();
    }
    const payload = curUser ? curUser.decodedJwt : decodedJwt;
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

  const assignUser = () => {
    if (!token()) {
      setUser(undefined);
      return undefined;
    }
    const payload = decodeJwt(token()!);
    try {
      axios
        .get(`${BACKEND}/user`, { withCredentials: true })
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
    const to = location.query.to;
    if (typeof to === "string") {
      navigate(to);
    } else {
      navigate(route);
    }
  };

  const hasClaim = (claim: string | undefined): boolean => {
    if (claim === undefined) {
      return true;
    }
    const payload = user()?.decodedJwt;
    if (!payload) {
      return false;
    }
    const claimFound = (payload.claim as Array<string>).findIndex(
      (value) => value === claim
    ) !== -1;
    return claimFound;
  };

  const login = async (params: { email: string; password: string }) => {
    try {
      await axios.post(`${BACKEND}/auth/login`, params, {
        withCredentials: true,
      });
      assignUser();
      handleRedirect("/");
      ToastSuccess("Вхід успішний\nВи авторизовані обліковим записом");
    } catch (error) {
      ToastError(`Вхід невдалий\n${error}`);
    }
  };

  const relogin = async () => {
    try {
      await axios.post(
        `${BACKEND}/auth/relogin`,
        {},
        { withCredentials: true }
      );
      assignUser();
    } catch (error) {
      ToastError(`Помилка входу без паролю через кукі\n${error}`);
    }
  };

  const register = async (params: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      await axios.post(`${BACKEND}/auth/register`, params, {
        withCredentials: true,
      });
      handleRedirect("/login");
      ToastSuccess("Реєстрація успішна\nТепер існує новий користувач");
    } catch (error) {
      ToastError(`Помилка реєстрації\n${error}`);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${BACKEND}/auth/logout`, {}, { withCredentials: true });
      setUser(undefined);
      ToastSuccess("Вихід 👽\nВи більше не маєте наших кукі");
      handleRedirect("/");
    } catch (error) {
      ToastError(`Помилка виходу\n${error}`);
    }
  };

  const checkLogin = () => {
    loginRoutine();
    const reloginInterval = setTimeout(checkLogin, 30000);
    return () => clearInterval(reloginInterval);
  };
  checkLogin();

  createEffect(() => {
    loginRoutine();
  });

  createEffect(on(token, () => loginRoutine()));

  return (
    <AuthContext.Provider
      value={{
        user,
        hasClaim,
        login,
        register,
        logout,
        assignUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
