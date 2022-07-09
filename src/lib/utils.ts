import {
  HEARTS_PER_HEX,
  DAY_ONE_START,
  UNITS,
  SI_SYMBOL,
} from "~/lib/constants";

const heartsToHex = (hearts: number) => {
  return hearts / Number(HEARTS_PER_HEX);
};

const format = (num: number, maxFracDigits = 3) => {
  return Intl.NumberFormat("en-us", {
    maximumFractionDigits: maxFracDigits,
  }).format(num);
};

// percent formatter
const formatPercent = (num: number) => {
  return format(num * 100, 2) + "%";
};

const dayToFormattedDate = (day: number) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(dayToDate(day));

const dayToTimestamp = (day: number) =>
  convertTime(day, "days") + DAY_ONE_START;

const dayToDate = (day: number) => {
  const startTimestamp = dayToTimestamp(day);
  return new Date(convertTime(startTimestamp, "seconds", "milliseconds"));
};

const dateToDay = (date: Date) => {
  const seconds = convertTime(date.getTime(), "milliseconds");
  const fractionalDay = convertTime(seconds - DAY_ONE_START, "seconds", "days");
  return Math.floor(fractionalDay);
};

const convertTime = (amount: number, fromUnit: string, toUnit = "seconds") =>
  (amount * UNITS[fromUnit]) / UNITS[toUnit];

const dateToTimestamp = (date: Date) => Math.floor(date.getTime() / 1000);

const sharesToSI = (shares: number) => {
  // what tier? (determines SI symbol)
  var tier = (Math.log10(Math.abs(shares)) / 3) | 0;

  // if zero, we don't need a suffix
  if (tier == 0) return `${shares}`;

  // get suffix and determine scale
  var suffix = SI_SYMBOL[tier];
  var scale = Math.pow(10, tier * 3);

  // scale the shares
  var scaled = shares / scale;

  // format number and add suffix
  return `${scaled.toFixed(1)} ${suffix}-Shares`;
};

export { format, heartsToHex, formatPercent, dayToFormattedDate, sharesToSI };
