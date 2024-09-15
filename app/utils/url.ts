import { IUser } from "~/models/user.model";

export function getDashboardUrl(user: Pick<IUser, "role">) {
  return user.role === "client"
    ? "/account/client/dashboard"
    : user.role === "admin"
      ? "/account/admin/dashboard"
      : user.role === "team"
        ? "/account/team/dashboard"
        : "/";
}

export function getUrlFromSearchParams(url: string, searchParam: string) {
  const fUrl = new URL(url);
  return fUrl.searchParams.get(searchParam);
}

export function getRefererUrl(request: Request) {
  return request.headers.get("referer");
}

export function getPathname(request: Request) {
  return new URL(request.url).pathname;
}

export function queryStringBuilder(
  url: string,
  ...args: { key: string; value: string }[]
) {
  const queryParam = args
    .map((query) => `${query.key}=${encodeURIComponent(query.value)}`)
    .join("&");

  return `${url}?${queryParam}`;
}
