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
    return e instanceof AppError && e.isOperational
      ? {
          message: e.message,
          statusCode: e.statusCode,
          status: e.status,
          path: e?.path,
        }
      : {
          message: "Something went very wrong💥💥",
          statusCode: 500,
          status: "error",
        };
  });
}

function handleDbDuplicateError(err: MongoServerError) {
  const [key, value] = Object.entries(err.keyValue);
  return [
    new AppError(
      `The ${key} ${value} is already in use. Please use a different ${key}`,
      409,
    ),
  ];
}

function handleDbValidationError(err: MongoServerError) {
  return Object.keys(err.errors).map((key) => {
    return new AppError(err.errors[key].message, 400, key);
  });

  // const message = Object.keys(err.errors)
  //   .map((key) => err.errors[key].message)
  //   .join(". ");
  // return new AppError(message, 400);
}

export function handleDbCastError(err: CastError) {
  return [new AppError(`Invalid ${err.path}: ${err.value}`, 400)];
}

export default function globalErrorHandler(err: DevProdArgs) {
  if (appConfig.nodeEnv === "production") {
    const errorCopy = clonedeep(err);
    const errorArray = [];

    if ((err as MongoServerError).code === 1100) {
      errorArray.push(handleDbDuplicateError(errorCopy as MongoServerError));
    } else if (err.name === "ValidationError") {
      errorArray.push(handleDbValidationError(errorCopy as MongoServerError));
    } else if (err.name === "CastError") {
      errorArray.push(handleDbCastError(errorCopy as CastError));
    }

    return handleProdError([errorCopy]);
  } else {
    return handleDevError([err]);
  }
}
