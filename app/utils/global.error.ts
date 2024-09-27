import { MongoServerError } from "mongodb";
import { AppError } from "~/utils/app.error";
import { CastError } from "mongoose";
import clonedeep from "clone-deep";
import appConfig from "../../app.config";

export type DevProdArgs = Error | AppError | MongoServerError | CastError;

export type ProdError = {
  message: string;
  statusCode: number;
  status: AppError["status"];
  path?: string;
};

function handleDevError(err: DevProdArgs[]): AppError[] {
  return err.map((e) => {
    if (e instanceof AppError) {
      return {
        name: e.name,
        message: e.message,
        statusCode: e.statusCode,
        status: e.status,
        stack: e.stack,
        path: e?.path,
        isOperational: e.isOperational,
      };
    } else {
      return {
        name: e.name,
        message: e.message,
        stack: e.stack,
        statusCode: 500,
        status: "error",
        isOperational: false,
      };
    }
  });
}

function handleProdError(err: DevProdArgs[]): ProdError[] {
  return err.map((e) => {
    // console.log({ debuggingError: e });
    return e instanceof AppError && e.isOperational
      ? {
          message: e.message,
          statusCode: e.statusCode,
          status: e.status,
          path: e?.path,
        }
      : {
          message: "Something went very wrong",
          statusCode: 500,
          status: "error",
        };
  });
}

function handleDbDuplicateError(err: MongoServerError) {
  const [key, value] = Object.entries(err.keyValue)[0];
  return [
    new AppError(
      `The ${key} ${value} is already in use. Please use a different ${key}`,
      409,
      String(key),
    ),
  ];
}

function handleDbValidationError(err: MongoServerError) {
  return Object.keys(err.errors).map((key) => {
    // console.log({ key: key });
    return new AppError(err.errors[key].message, 400, key);
  });

  // const message = Object.keys(err.errors)
  //   .map((key) => err.errors[key].message)
  //   .join(". ");
  // return new AppError(message, 400);
}

function handleJwtTokenExpiredError() {
  return [new AppError("Your session has expired", 401)];
}

export function handleJwtJsonWebTokenError() {
  return [new AppError("Your session is malformed", 401)];
}

export function handleDbCastError(err: CastError) {
  return [new AppError(`Invalid ${err.path}: ${err.value}`, 400, err.path)];
}
export default function globalErrorHandler(err: DevProdArgs) {
  if (appConfig.nodeEnv === "production" || appConfig.nodeEnv === "test") {
    const errorCopy = clonedeep(err);
    let errorArray = [];

    if ((err as MongoServerError).code === 11000) {
      errorArray = [...handleDbDuplicateError(errorCopy as MongoServerError)];
    } else if (err.name === "ValidationError") {
      errorArray = [...handleDbValidationError(errorCopy as MongoServerError)];
    } else if (err.name === "CastError") {
      errorArray = [...handleDbCastError(errorCopy as CastError)];
    } else if (err.name === "TokenExpiredError") {
      errorArray = [...handleJwtTokenExpiredError()];
    } else if (err.name === "JsonWebTokenError") {
      errorArray = [...handleJwtJsonWebTokenError()];
    } else {
      errorArray = [errorCopy];
    }
    return handleProdError(errorArray);
  } else {
    return handleDevError([err]);
  }
}

export const getFieldError = (
  name: string,
  errorArray: (AppError[] | ProdError[]) | undefined,
) => {
  const error = errorArray?.find((e) => e.path === name);
  return error
    ? {
        message: error.message,
        isValid: false,
      }
    : {
        isValid: true,
      };
};
