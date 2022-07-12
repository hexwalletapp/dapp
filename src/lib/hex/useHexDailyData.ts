import { useContractRead } from "wagmi";
import { hexContract } from "~/lib/constants";
import { decodeDailyData } from "./helpers";

export const useHexDailyData = (chainId: number, enableRead: boolean) => {
  const { data: currentDay } = useContractRead({
    ...hexContract,
    functionName: "currentDay",
    enabled: enableRead,
  });
  const { data: dailyDataRange } = useContractRead({
    ...hexContract,
    functionName: "dailyDataRange",
    args: [0, currentDay],
    enabled: enableRead,
  });

  const dailyDataDays = dailyDataRange?.map((dailyDataDay) => {
    return decodeDailyData(dailyDataDay);
  });

  return {
    currentDay: Number(currentDay),
    dailyDataDays: dailyDataDays,
  };
};
