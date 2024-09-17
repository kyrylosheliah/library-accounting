import {
  createHandler,
  renderAsync,
  StartServer,
} from "solid-start/entry-server";
import { parseCookieString } from "./utils/parseCookieString";
import decodeJwt from "./utils/decodeJwt";
import { redirect } from "solid-start/server";

const protectedRoutes = [
  { route: "/user" },
  { route: "/accounting", claim: "librarian" },
  { route: "/management", claim: "admin" },
];
function isProtectedRoute(url: string): any {
  const index = protectedRoutes.findIndex((item) => url.includes(item.route));
  const found = index !== -1;
  return {
    isProtected: found,
    claim: found ? protectedRoutes[index].claim : undefined,
  };
}
function hasClaim(claim: string | undefined, decodedToken: any): boolean {
  if (claim) {
    if (decodedToken) {
      const tokenClaim = decodedToken[claim];
      if (tokenClaim === "true") {
        return true;
      }
    }
    return false;
  }
  return true;
}

function interceptedRedirect(url: URL, route: string, to: string) {
  url.pathname = route;
  if (to !== undefined) {
    if (!url.searchParams.has("to")) {
      url.searchParams.set("to", to);
    }
  }
  return redirect(url.pathname + url.search);
}

export default createHandler(
  ({ forward }) =>
    async (event) => {
      const url = new URL(event.request.url);
      const { isProtected, claim } = isProtectedRoute(url.pathname);
      const token = parseCookieString(
        event.request.headers.get("Cookie") || ""
      ).token;
      if (token) {
        const decodedToken = decodeJwt(token);
        const now = new Date().getTime() / 1000;
        const isExpired = now >= decodedToken.exp;
        if (isExpired && isProtected) {
          // ToastInfo(`Ваша сесія сплила.\nАвторизуйтеся для повернення.`);
          return interceptedRedirect(url, "/login", url.pathname);
        }
        if (claim) {
          if (!hasClaim(claim, decodedToken)) {
            return redirect("/404");
          }
        }
      } else if (isProtected) {
        // ToastError(
        //   `До ${url.pathname} неможна без дозволу.\nМожливо, ви маєте відповідний акаунт?`
        // );
        return redirect("/login");
      }
      return forward(event);
    },
  renderAsync((event) => <StartServer event={event} />)
);
