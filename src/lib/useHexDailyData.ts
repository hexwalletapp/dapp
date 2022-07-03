import { useContractRead } from "wagmi";
import { hexContract } from "~/lib/constants";

export const useHexDailyData = (chainId: number) => {
  const { data: currentDay } = useContractRead({
    ...hexContract,
    functionName: "currentDay",
  });
  const { data: dailyDataRange } = useContractRead({
    ...hexContract,
    functionName: "dailyDataRange",
    args: [0, currentDay],
  });

  const HEARTS_UINT_SHIFT = 72n;
  const HEARTS_MASK = (1n << HEARTS_UINT_SHIFT) - 1n;
  const SATS_UINT_SHIFT = 56n;
  const SATS_MASK = (1n << SATS_UINT_SHIFT) - 1n;
  const decodeDailyData = (encDay: BigInt) => {
    let v = BigInt(encDay.valueOf());
    let payout = v & HEARTS_MASK;
    v = v >> HEARTS_UINT_SHIFT;
    let shares = v & HEARTS_MASK;
    v = v >> HEARTS_UINT_SHIFT;
    let sats = v & SATS_MASK;
    return { payout, shares, sats };
  };

  const dailyDataDays = dailyDataRange?.map((dailyDataDay) => {
    return decodeDailyData(dailyDataDay);
  });

  return {
    currentDay: currentDay,
    dailyDataDays: dailyDataDays,
  };
};
