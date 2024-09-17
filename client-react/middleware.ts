import { NextURL } from "next/dist/server/web/next-url";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import decodeJwt from "./helpers/decodeJwt";

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
function checkClaim(claim: string | undefined, decodedToken: any): boolean {
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

function redirect(
  nextUrl: NextURL,
  route: string,
  currentUri: string | undefined = undefined
) {
  const uri = nextUrl.clone();
  uri.pathname = route;
  if (currentUri !== undefined) {
    if (!uri.searchParams.has("to")) {
      uri.searchParams.set("to", currentUri);
    }
  }
  return NextResponse.redirect(uri);
}

export async function middleware(request: NextRequest) {
  const { url, cookies } = request;
  const token = cookies.get("token")?.value;
  const { isProtected, claim } = isProtectedRoute(url);

  if (token) {
    const decodedToken = decodeJwt(token);
    const now = new Date().getTime() / 1000;
    const isExpired = now >= decodedToken.exp;
    if (isExpired) {
      return redirect(request.nextUrl, url, "/login");
    }
    if (claim) {
      const hasClaim = checkClaim(claim, decodedToken);
      if (!hasClaim) {
        return redirect(request.nextUrl, "/error");
      }
    }
  } else {
    if (isProtected) {
      return redirect(request.nextUrl, "/login");
    }
  }
  return NextResponse.next();
}
