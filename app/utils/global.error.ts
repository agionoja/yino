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
};

function handleDevError(err: DevProdArgs): AppError {
  if (err instanceof AppError) {
    return {
      name: err.name,
      message: err.message,
      statusCode: err.statusCode,
      status: err.status,
      stack: err.stack,
      isOperational: err.isOperational,
    };
  } else {
    return {
      name: err.name,
      message: err.message,
      statusCode: 500,
      status: "error",
      stack: err.stack,
      isOperational: false,
    };
  }
}

function handleProdError(err: DevProdArgs): ProdError {
  return err instanceof AppError && err.isOperational
    ? {
        message: err.message,
        statusCode: err.statusCode,
        status: err.status,
      }
    : {
        message: "Something went very wrong💥💥",
        statusCode: 500,
        status: "error",
      };
}

function handleDbDuplicateError(err: MongoServerError) {
  const [key, value] = Object.entries(err.keyValue);
  return new AppError(
    `The ${key} ${value} is already in use. Please use a different ${key}`,
    409,
  );
}

function handleDbValidationError(err: MongoServerError) {
  const message = Object.keys(err.errors)
    .map((key) => err.erros[key].message)
    .join(". ");
  return new AppError(message, 400);
}

export function handleDbCastError(err: CastError) {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
}

export default function globalErrorHandler(err: DevProdArgs) {
  if (appConfig.nodeEnv === "production") {
    let errorCopy = clonedeep(err);

    if ((err as MongoServerError).code === 1100) {
      errorCopy = handleDbDuplicateError(err as MongoServerError);
    } else if (err.name === "ValidationError") {
      errorCopy = handleDbValidationError(err as MongoServerError);
    } else if (err.name === "CastError") {
      errorCopy = handleDbCastError(err as CastError);
    }

    return handleProdError(errorCopy);
  } else {
    return handleDevError(err);
  }
}
