import type { NextPage } from "next";
import type { Stake, LineItem } from "utils/account-types";
import { useState } from "react";
import { chain } from "wagmi";
import { useHexDailyData, useHexStakes } from "~/lib/hex";
import { getBigPayDayBonus, interestForRange } from "~/lib/hex/helpers";
import { DAY_ONE_START, ONE_DAY } from "~/lib/constants";
import { StakeCard } from "~/components/ui/StakeCard";
const Home: NextPage = () => {
  const [hexPrice] = useState<number>(1);
  const [stakeAddress, setStakeAddress] = useState("");
  const { currentDay, dailyDataDays } = useHexDailyData(chain.mainnet.id);
  const { stakeCount: stakeCountETH, stakes: stakesETH } = useHexStakes(
    stakeAddress,
    chain.mainnet.id
  );

  // const { stakeCount: stakeCountPLS, stakes: stakesPLS } = useHexStakes(
  //   stakeAddress,
  //   pulseChain.id
  // );

  const stakes = stakesETH?.map((stake: any) => {
    const stakeDailyDataDays = dailyDataDays?.slice(
      stake.lockedDay,
      stake.lockedDay + stake.stakedDays
    );

    const interestHEX =
      interestForRange(stakeDailyDataDays, BigInt(stake.stakeShares)) ?? 0;

    const bigPayDayHEX = getBigPayDayBonus(
      stake.lockedDay,
      stake.stakedDays,
      BigInt(stake.stakeShares)
    );

    const principal: LineItem = {
      name: "PRINCIPAL",
      valueUSD: stake.stakeShares * hexPrice,
      valueHEX: stake.stakeShares,
    };

    const interest: LineItem = {
      name: "INTEREST",
      valueUSD: Number(interestHEX) * hexPrice,
      valueHEX: Number(interestHEX),
    };

    const bigPayDay: LineItem = {
      name: "BIG PAY DAY",
      valueUSD: Number(bigPayDayHEX) * hexPrice,
      valueHEX: Number(bigPayDayHEX),
    };

    const currentStake: Stake = {
      stakeId: stake.stakeId,
      status: "active",
      startDate: DAY_ONE_START + stake.lockedDay * ONE_DAY,
      endDate: DAY_ONE_START + (stake.lockedDay + stake.stakedDays) * ONE_DAY,
      percentComplete: 0,
      shares: stake.stakeShares,
      lineItems: [principal, interest, bigPayDay],
    };
    return currentStake;
  });

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

      <h4>
        HEX Stakes:
        {stakeCountETH?.toString()}
      </h4>

      <div className="grid grid-cols-3 gap-4">
        {stakes?.map((stake: Stake, index: number) => (
          <div key={index}>
            {/* <div>{stake.stakeId}</div> */}
            <StakeCard stake={stake} />
          </div>
        ))}
      </div>

      {/* <h4>PLS Stakes: ({stakeCountPLS?.toString()})</h4>
      <ol>
        {stakesPLS?.map((stake, index) => (
          <li key={index}>
            <div>{`${stake}`}</div>
          </li>
        ))}
      </ol> */}
    </div>
  );
};

export default Home;
