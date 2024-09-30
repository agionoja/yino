interface ErrorField {
  path?: string;
  message?: string;
}

export function getFieldError<T extends ErrorField>(
  name: string,
  err?: T[] | null,
) {
  const error = err?.find((e) => e.path === name);
  // console.log({ error: error });
  return error
    ? {
        message: error.message,
        isValid: false,
      }
    : {
        isValid: true,
      };
}
