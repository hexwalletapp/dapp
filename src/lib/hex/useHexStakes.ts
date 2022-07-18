import type { Stake, LineItem } from "utils/account-types";

import { useContractRead, useContractReads } from "wagmi";
import { hexContract } from "~/lib/constants";
import { useHexDailyData } from "~/lib/hex";
import { validateAddress } from "../utils";
import { getHexPrice } from "~/lib/uniswap/helpers";
import { getBigPayDayBonus, interestForRange } from "~/lib/hex/helpers";
import {
  heartsToHex,
  format,
  formatPercent,
  dayToFormattedDate,
  sharesToSI,
} from "~/lib/utils";
import { useEffect, useState } from "react";

export const useHexStakes = async (stakeAddress: string, chainId: number) => {
  const enableRead = validateAddress(stakeAddress) != null;

  const [hexPrice, setHexPrice] = useState(0);
  const { currentDay, dailyDataDays } = useHexDailyData(chainId, enableRead);
  const { data: stakeCount, isLoading: stakeCountIsLoading } = useContractRead({
    ...hexContract,
    functionName: "stakeCount",
    args: stakeAddress,
    chainId: chainId,
    enabled: enableRead,
  });

  const allStakes = Array.from(
    { length: Number(stakeCount) },
    (v, stakeIndex) => ({
      ...hexContract,
      functionName: "stakeLists",
      args: [stakeAddress, stakeIndex],
      chainId: chainId,
      enabled: enableRead,
    })
  );

  const { data: stakes, isLoading: stakesAreLoading } = useContractReads({
    contracts: allStakes,
  });

  useEffect(() => {
    const fetchData = async () => {
      const trade = await getHexPrice();
      setHexPrice(
        Number(trade.expectedConvertQuote) / Number(trade.baseConvertRequest)
      );
    };
    fetchData();
  }, [hexPrice]);

  return {
    stakeCount: stakeCount,
    stakes: buildStakeModel(stakes, hexPrice, currentDay, dailyDataDays),
    stakeCountIsLoading: stakeCountIsLoading,
    stakesAreLoading: stakesAreLoading,
  };
};

// createbuildStakeModel and return array of stakes

const buildStakeModel = (
  stakes: any,
  hexPrice: number,
  currentDay: number,
  dailyDataDays: any
): [Stake] => {
  return stakes?.map((stake: any) => {
    const daysStaked = currentDay - Number(stake.lockedDay);
    const stakeDailyDataDays = dailyDataDays?.slice(
      stake.lockedDay,
      stake.lockedDay + stake.stakedDays
    );

    // Principal
    const principalHEX = heartsToHex(Number(stake.stakeShares));
    const principalUSD = principalHEX * hexPrice;
    const principal: LineItem = {
      name: "PRINCIPAL",
      valueUSD: "$" + format(principalUSD, 2),
      valueHEX: format(principalHEX, 0),
    };

    // Interest
    const interestHearts =
      interestForRange(stakeDailyDataDays, BigInt(stake.stakeShares)) ?? 0;
    const interestHEX = heartsToHex(Number(interestHearts));
    const interestUSD = interestHEX * hexPrice;
    const interest: LineItem = {
      name: "INTEREST",
      valueUSD: "$" + format(interestUSD, 2),
      valueHEX: format(interestHEX, 0),
    };

    // Big Pay Day
    const bigPayDayHearts = getBigPayDayBonus(
      stake.lockedDay,
      stake.stakedDays,
      BigInt(stake.stakeShares)
    );
    const bigPayDayHEX = heartsToHex(Number(bigPayDayHearts));
    const bigPayDay: LineItem = {
      name: "BPD",
      valueUSD: "$" + format(bigPayDayHEX * hexPrice, 2),
      valueHEX: format(bigPayDayHEX, 0),
    };

    // Total
    const totalHEX = principalHEX + interestHEX + bigPayDayHEX;
    const totalUSD = totalHEX * hexPrice;
    const total: LineItem = {
      name: "TOTAL",
      valueUSD: "$" + format(totalUSD, 2),
      valueHEX: format(totalHEX, 0),
    };

    // ROI
    const roiHEX = interestHEX / principalHEX;
    const roiUSD = interestUSD / principalUSD;
    const roi: LineItem = {
      name: "ROI",
      valueUSD: formatPercent(roiUSD),
      valueHEX: formatPercent(roiHEX),
    };

    // APY
    const apyHEX = (roiHEX * 365) / daysStaked;
    const apyUSD = (roiUSD * 365) / daysStaked;
    const apy: LineItem = {
      name: "APY",
      valueUSD: formatPercent(apyUSD),
      valueHEX: formatPercent(apyHEX),
    };

    const percentComplete = Number(
      format(((currentDay - stake.lockedDay) / stake.stakedDays) * 100, 1)
    );
    const currentStake: Stake = {
      stakeId: stake.stakeId,
      status: "active",
      startDate: dayToFormattedDate(stake.lockedDay),
      endDate: dayToFormattedDate(stake.lockedDay + stake.stakedDays),
      percentComplete: percentComplete,
      shares: sharesToSI(stake.stakeShares),
      lineItems: [principal, interest, bigPayDay, total, roi, apy],
    };
    return currentStake;
  });
};
