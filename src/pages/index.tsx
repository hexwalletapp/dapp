import type { NextPage } from "next";
import { useState } from "react";
import { pulseChain } from "~/lib/pulsechain";
import { chain } from "wagmi";
import useHexStakes from "~/lib/useHexStakes";

const Home: NextPage = () => {
  const [stakeAddress, setStakeAddress] = useState("");
  const { stakeCount: stakeCountETH, stakes: stakesETH } = useHexStakes(
    stakeAddress,
    chain.mainnet.id
  );
  const { stakeCount: stakeCountPLS, stakes: stakesPLS } = useHexStakes(
    stakeAddress,
    pulseChain.id
  );

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
      <h4>HEX Stakes: ({stakeCountETH?.toString()})</h4>
      <ol>
        {stakesETH?.map((stake, index) => (
          <li key={index}>
            <div>{`${stake}`}</div>
          </li>
        ))}
      </ol>

      <h4>PLS Stakes: ({stakeCountPLS?.toString()})</h4>
      <ol>
        {stakesPLS?.map((stake, index) => (
          <li key={index}>
            <div>{`${stake}`}</div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Home;
