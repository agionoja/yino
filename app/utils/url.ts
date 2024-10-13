export function getUrlFromSearchParams(url: string, searchParam: string) {
  const fUrl = new URL(url);
  return fUrl.searchParams.get(searchParam);
}

export function getRefererUrl(request: Request) {
  return request.headers.get("referer");
}

export function getPathname(request: Request) {
  const url = new URL(request.url);
  console.log({ url });
  return url.pathname;
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

export function getBaseUrl(request: Request): string {
  const { protocol, host } = new URL(request.url);
  return `${protocol}//${host}`;
}
