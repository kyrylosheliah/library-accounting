export const parseCookieString = (cookieString: string) => {
  let cookies: { [key: string]: string | undefined } = {};
  const elements = cookieString.split(";");
  for (let i = elements.length - 1; i >= 0; --i) {
    let nameValue = elements[i].split("=");
    cookies[nameValue[0].trim()] = nameValue[1];
  }
  return cookies;
};
