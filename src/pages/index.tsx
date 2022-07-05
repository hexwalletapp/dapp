import type { NextPage } from "next";
import type { Stake, LineItem } from "utils/account-types";
import { useEffect, useState } from "react";
import { chain } from "wagmi";
import { useHexDailyData, useHexStakes } from "~/lib/hex";
import { getHexPrice } from "~/lib/uniswap/helpers";
import { getBigPayDayBonus, interestForRange } from "~/lib/hex/helpers";
import { DAY_ONE_START, ONE_DAY } from "~/lib/constants";
import { StakeCard } from "~/components/ui/StakeCard";
import { heartsToHex, format } from "~/lib/utils";

const Home: NextPage = () => {
  const [hexPrice, setHexPrice] = useState<number>(0);
  const [stakeAddress, setStakeAddress] = useState("");
  const { currentDay, dailyDataDays } = useHexDailyData(chain.mainnet.id);
  const { stakeCount: stakeCountETH, stakes: stakesETH } = useHexStakes(
    stakeAddress,
    chain.mainnet.id
  );

  const stakes = stakesETH?.map((stake: any) => {
    const stakeDailyDataDays = dailyDataDays?.slice(
      stake.lockedDay,
      stake.lockedDay + stake.stakedDays
    );

    // Principal
    const principalHEX = heartsToHex(Number(stake.stakeShares));
    const principal: LineItem = {
      name: "PRINCIPAL",
      valueUSD: "$" + format(principalHEX * hexPrice),
      valueHEX: format(principalHEX),
    };

    // Interest
    const interestHearts =
      interestForRange(stakeDailyDataDays, BigInt(stake.stakeShares)) ?? 0;
    const interestHEX = heartsToHex(Number(interestHearts));
    const interest: LineItem = {
      name: "INTEREST",
      valueUSD: "$" + format(interestHEX * hexPrice),
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
    const total: LineItem = {
      name: "TOTAL",
      valueUSD: "$" + format(totalHEX * hexPrice),
      valueHEX: format(totalHEX),
    };

    const currentStake: Stake = {
      stakeId: stake.stakeId,
      status: "active",
      startDate: DAY_ONE_START + stake.lockedDay * ONE_DAY,
      endDate: DAY_ONE_START + (stake.lockedDay + stake.stakedDays) * ONE_DAY,
      percentComplete: 0,
      shares: stake.stakeShares,
      lineItems: [principal, interest, bigPayDay, total],
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
      <label htmlFor="chain">Staker Address: </label>

      <input
        title="Stake Address"
        className="input bg-gray-100 w-full max-w-md"
        type="input"
        placeholder="0x..."
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        value={stakeAddress}
        onChange={(e) => setStakeAddress(e.target.value)}
      />
      <pre>{stakeAddress}</pre>

      <label> HEX Stakes: </label>
      <output>{stakeCountETH?.toString()}</output>

      <br></br>

      <label>HEX Price: </label>
      <output>${format(hexPrice)}</output>

      <div className="grid grid-cols-3 gap-4">
        {stakes?.map((stake: Stake, index: number) => (
          <div key={index}>
            {/* <div>{stake.stakeId}</div> */}
            <StakeCard stake={stake} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
