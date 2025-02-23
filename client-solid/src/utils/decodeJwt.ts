import { Buffer } from "buffer";
import { isServer } from "solid-js/web";
if (!isServer) {
  window.Buffer = window.Buffer || Buffer;
}

export default function decodeJwt(token: string): any {
  if (!token) {
    return null;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(Buffer.from(base64, "base64").toString());
}
