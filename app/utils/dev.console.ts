import appConfig from "../../app.config";

export function logDevError(...args: any[]) {
  if (appConfig.nodeEnv !== "production") console.error(...args);
}

export function logDevWarning(...args: any[]) {
  if (appConfig.nodeEnv !== "production") console.warn(...args);
}

export function logDevInfo(...args: any[]) {
  if (appConfig.nodeEnv !== "production") console.info(...args);
}

export function logDev(...args: any[]) {
  if (appConfig.nodeEnv !== "production") console.log(...args);
}
