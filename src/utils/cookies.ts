export interface CookieOptions {
  path?: string;
  expires?: number | Date | string;
}

const isBrowser = typeof document !== "undefined";

export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  if (!isBrowser) {
    return;
  }

  const { path = "/", expires } = options;
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (expires !== undefined) {
    let expiresValue = expires;

    if (typeof expires === "number") {
      const date = new Date();
      date.setTime(date.getTime() + expires * 1000);
      expiresValue = date.toUTCString();
    } else if (expires instanceof Date) {
      expiresValue = expires.toUTCString();
    }

    cookieString += `; expires=${expiresValue}`;
  }

  cookieString += `; path=${path}`;
  document.cookie = cookieString;
}

export function getCookie(name: string): string | undefined {
  if (!isBrowser) {
    return undefined;
  }

  const escapedName = name.replace(/([.*+?^${}()|[\]\\])/g, "\\$1");
  const matches = document.cookie.match(
    new RegExp(`(?:^|; )${escapedName}=([^;]*)`)
  );

  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function deleteCookie(name: string): void {
  if (!isBrowser) {
    return;
  }

  setCookie(name, "", { expires: -1 });
}
