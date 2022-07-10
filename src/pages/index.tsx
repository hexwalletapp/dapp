import type { NextPage } from "next";
import type { Stake, LineItem } from "utils/account-types";
import { useEffect, useState } from "react";
import { chain } from "wagmi";
import { useHexDailyData, useHexStakes } from "~/lib/hex";
import { getHexPrice } from "~/lib/uniswap/helpers";
import { getBigPayDayBonus, interestForRange } from "~/lib/hex/helpers";
import { StakeCard } from "~/components/ui/StakeCard";
import {
  heartsToHex,
  format,
  formatPercent,
  dayToFormattedDate,
  sharesToSI,
} from "~/lib/utils";

const Home: NextPage = () => {
  const [hexPrice, setHexPrice] = useState<number>(0);
  const [stakeAddress, setStakeAddress] = useState("");
  const { currentDay, dailyDataDays } = useHexDailyData(chain.mainnet.id);
  const { stakeCount: stakeCountETH, stakes: stakesETH } = useHexStakes(
    stakeAddress,
    chain.mainnet.id
  );

  const stakes = stakesETH?.map((stake: any) => {
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
      valueUSD: "$" + format(principalUSD),
      valueHEX: format(principalHEX),
    };

    // Interest
    const interestHearts =
      interestForRange(stakeDailyDataDays, BigInt(stake.stakeShares)) ?? 0;
    const interestHEX = heartsToHex(Number(interestHearts));
    const interestUSD = interestHEX * hexPrice;
    const interest: LineItem = {
      name: "INTEREST",
      valueUSD: "$" + format(interestUSD),
      valueHEX: format(interestHEX),
    };

    // Big Pay Day
    const bigPayDayHearts = getBigPayDayBonus(
      stake.lockedDay,
      stake.stakedDays,
      BigInt(stake.stakeShares)
    );
    const bigPayDayHEX = heartsToHex(Number(bigPayDayHearts));
    const bigPayDay: LineItem = {
      name: "BIG PAY DAY",
      valueUSD: "$" + format(bigPayDayHEX * hexPrice),
      valueHEX: format(bigPayDayHEX),
    };

    // Total
    const totalHEX = principalHEX + interestHEX + bigPayDayHEX;
    const totalUSD = totalHEX * hexPrice;
    const total: LineItem = {
      name: "TOTAL",
      valueUSD: "$" + format(totalUSD),
      valueHEX: format(totalHEX),
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

  useEffect(() => {
    const fetchData = async () => {
      const trade = await getHexPrice();
      setHexPrice(
        Number(trade.expectedConvertQuote) / Number(trade.baseConvertRequest)
      );
    };
    fetchData();
  }, [stakes]);

  return (
    <div>
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <label htmlFor="chain">Staker Address: </label>

              <input
                title="Stake Address"
                className="input bg-gray-100 w-full max-w-md"
                type="input"
                placeholder="0x..."
                autoComplete="off"
                autoCapitalize="off"
                // autoCorrect="off"
                value={stakeAddress}
                onChange={(e) => setStakeAddress(e.target.value.trim())}
              />

              <output>{stakeCountETH?.toString()}</output>

              <br></br>

              <label>HEX Price: </label>
              <output>${format(hexPrice)}</output>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {stakes?.map((stake: Stake, index: number) => (
                  <div key={index}>
                    <StakeCard stake={stake} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
