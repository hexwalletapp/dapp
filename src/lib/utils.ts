import { HEARTS_PER_HEX } from "~/lib/constants";

// create a function that takes hearts and divides by HEARTS_PER_HEX

const heartsToHex = (hearts: number) => {
  return hearts / Number(HEARTS_PER_HEX);
};

const format = (num: number, maxFracDigits = 3) => {
  return Intl.NumberFormat("en-us", {
    maximumFractionDigits: maxFracDigits,
  }).format(num);
};

export { format, heartsToHex };
