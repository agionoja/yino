import {
  createCookieSessionStorage,
  redirect,
  replace,
  Session,
} from "@remix-run/node";
import { cookieDefaultOptions } from "~/cookies.server";
import {
  FlashSessionValue,
  flashSessionValuesSchema,
  ToastMessage,
} from "~/utils/toast/schema";
import { destroySession } from "~/session.server";
import { getPathname, queryStringBuilder } from "~/utils/url";

const FLASH_SESSION = "__flash";

export const flashSessionStorage = createCookieSessionStorage({
  cookie: {
    ...cookieDefaultOptions,
    maxAge: 5,
    name: FLASH_SESSION,
  },
});

function getSessionFromRequest(request: Request) {
  const cookie = request.headers.get("Cookie");
  return flashSessionStorage.getSession(cookie);
}

export async function getFlashSession(request: Request) {
  const session = await getSessionFromRequest(request);
  const result = flashSessionValuesSchema.safeParse(session.get(FLASH_SESSION));
  const flash = result.success ? result.data : undefined;

  const headers = new Headers({
    "Set-Cookie": await flashSessionStorage.commitSession(session),
  });

  return { flash, headers };
}

export async function flashMessage(
  flash: FlashSessionValue,
  headers?: ResponseInit["headers"],
) {
  const session = await flashSessionStorage.getSession();

  session.flash(FLASH_SESSION, flash);

  const cookie = await flashSessionStorage.commitSession(session);
  const newHeaders = new Headers(headers);

  newHeaders.append("Set-Cookie", cookie);

  return newHeaders;
}

type FlashArgs = {
  url: string;
  flash: FlashSessionValue;
  init?: ResponseInit;
};

export async function redirectWithFlash({ url, flash, init }: FlashArgs) {
  return redirect(url, {
    ...init,
    headers: await flashMessage(flash, init?.headers),
  });
}

export async function replaceWithFlash({ url, flash, init }: FlashArgs) {
  return replace(url, {
    ...init,
    headers: await flashMessage(flash, init?.headers),
  });
}

export async function replaceWithToast(
  url: string,
  toast: ToastMessage,
  init?: ResponseInit,
) {
  return replaceWithFlash({ url, flash: { toast }, init });
}

export async function redirectWithToast(
  url: string,
  toast: ToastMessage,
  init?: ResponseInit,
) {
  return redirectWithFlash({ url, flash: { toast }, init });
}

export async function redirectWithErrorToast(
  url: string,
  text: string,
  init?: ResponseInit,
) {
  return redirectWithToast(url, { text: text, type: "error" }, init);
}

export async function redirectWithToastAndDestroyExistingSession(
  url: string,
  toast: ToastMessage,
  session: Session,
  init?: ResponseInit,
) {
  const destroyedSessionHeader = await destroySession(session);
  const toastHeader = await redirectWithToast(url, toast, init);
  const headers = new Headers(toastHeader.headers);

  headers.append("Set-Cookie", destroyedSessionHeader);

  return redirect(url, {
    ...init,
    headers,
  });
}

export async function redirectWithToastErrorEncodeUrlAndDestroySession(
  message: string,
  session: Session,
  request: Request,
  url: string,
) {
  const encodedUrl = queryStringBuilder(url, {
    key: "redirect",
    value: getPathname(request),
  });

  return await redirectWithToastAndDestroyExistingSession(
    encodedUrl,
    { text: message, type: "error" },
    session,
  );
}

export async function redirectWithToastAndEncodeUrl(
  request: Request,
  toast: ToastMessage,
  url: string,
) {
  const encodedUrl = queryStringBuilder(url, {
    key: "redirect",
    value: getPathname(request),
  });
  return redirectWithToast(encodedUrl, toast);
}

// todoL fix
