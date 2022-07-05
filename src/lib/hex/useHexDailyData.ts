import { useContractRead } from "wagmi";
import { hexContract } from "~/lib/constants";
import { decodeDailyData } from "./helpers";

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

  const dailyDataDays = dailyDataRange?.map((dailyDataDay) => {
    return decodeDailyData(dailyDataDay);
  });

  return {
    currentDay: Number(currentDay),
    dailyDataDays: dailyDataDays,
  };
};
