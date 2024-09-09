type Options = {
  ms?: number;
  s?: number;
  m?: number;
  h?: number;
  d?: number;
  w?: number;
  mt?: number;
  y?: number;
  unit?: "ms" | "s"; // Define the return unit: milliseconds (default) or seconds
};

const createTimeStamp = (options: Options = {}) => {
  const {
    m = 0,
    ms = 0,
    y = 0,
    mt = 0,
    s = 0,
    w = 0,
    h = 0,
    d = 0,
    unit = "ms",
  } = options;

  // Correct conversion factors
  const milliSec = ms; // ms is already in milliseconds
  const sec = s * 1000; // 1 second = 1000 milliseconds
  const min = m * 60 * 1000; // 1 minute = 60 seconds = 60 * 1000 milliseconds
  const hr = h * 60 * 60 * 1000; // 1 hour = 60 minutes = 60 * 60 * 1000 milliseconds
  const day = d * 24 * 60 * 60 * 1000; // 1 day = 24 hours = 24 * 60 * 60 * 1000 milliseconds
  const week = w * 7 * 24 * 60 * 60 * 1000; // 1 week = 7 days
  const month = mt * 30 * 24 * 60 * 60 * 1000; // Approximate 1 month = 30 days
  const year = y * 365.25 * 24 * 60 * 60 * 1000; // 1 year = 365.25 days (considering leap years)

  // Calculate total in milliseconds
  const totalMilliSec = milliSec + sec + min + hr + day + week + month + year;

  const timeStamp = Date.now() + totalMilliSec;

  // Convert to seconds if the unit is seconds, else return in milliseconds
  return unit === "s" ? Math.floor(timeStamp / 1000) : timeStamp;
};

export default createTimeStamp;
