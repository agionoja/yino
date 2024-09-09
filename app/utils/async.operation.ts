import globalErrorHandler, {
  DevProdArgs,
  ProdError,
} from "~/utils/global.error";
import { AppError } from "~/utils/app.error";

type AsyncResult<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: ProdError | AppError;
    };

export default async function AsyncOperationHandler<T>(
  fn: () => Promise<T>,
): Promise<AsyncResult<T>> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (err) {
    const error = globalErrorHandler(err as DevProdArgs);
    return { error, data: null };
  }
}
