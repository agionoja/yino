import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { cookieDefaultOptions } from "~/cookies";
import {
  FlashSessionValue,
  flashSessionValuesSchema,
  ToastMessage,
} from "~/utils/toast/schema";

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

export async function redirectWithFlash(
  url: string,
  flash: FlashSessionValue,
  init?: ResponseInit,
) {
  return redirect(url, {
    ...init,
    headers: await flashMessage(flash, init?.headers),
  });
}

export async function redirectWithToast(
  url: string,
  toast: ToastMessage,
  init?: ResponseInit,
) {
  return redirectWithFlash(url, { toast }, init);
}

export async function redirectWithErrorToast(
  url: string,
  text: string,
  init?: ResponseInit,
) {
  return redirectWithToast(url, { text: text, type: "error" }, init);
}
