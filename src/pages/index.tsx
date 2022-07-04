import type { NextPage } from "next";
import { useState } from "react";
import { pulseChain } from "~/lib/pulsechain";
import { chain, chainId } from "wagmi";
import { useHexDailyData, useHexStakes } from "~/lib/hex";

const Home: NextPage = () => {
  const [stakeAddress, setStakeAddress] = useState("");
  const { currentDay, dailyDataDays } = useHexDailyData(chain.mainnet.id);
  const {
    stakeCount: stakeCountETH,
    stakes: stakesETH,
    stakeCountIsLoading,
    stakesAreLoading,
  } = useHexStakes(stakeAddress, chain.mainnet.id);
  const { stakeCount: stakeCountPLS, stakes: stakesPLS } = useHexStakes(
    stakeAddress,
    pulseChain.id
  );

  const interestForRange = (dailyData: any, myShares: any) => {
    return dailyData?.reduce(
      (s: any, d: any) => s + interestForDay(d, myShares),
      0n
    );
  };

  const interestForDay = (dayObj: any, myShares: any) => {
    return (myShares * dayObj.payout) / dayObj.shares;
  };

  const interest = stakesETH?.map((stake: any) => {
    const stakeDailyDataDays = dailyDataDays?.slice(
      stake.lockedDay,
      stake.lockedDay + stake.stakedDays
    );
    return interestForRange(stakeDailyDataDays, BigInt(stake.stakeShares));
  });

  return (
    <div>
      <label htmlFor="chain"> Staker Address:</label>

      <input
        title="Stake Address"
        type="text"
        value={stakeAddress}
        onChange={(e) => setStakeAddress(e.target.value)}
      />
      <pre>{stakeAddress}</pre>

      <h4>
        HEX Stakes:
        {stakeCountETH?.toString()}
      </h4>
      <ol>
        {stakesETH &&
          stakesETH?.map((stake, index) => (
            <li key={index}>
              <div>{`${stake}`}</div>
            </li>
          ))}
      </ol>

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
