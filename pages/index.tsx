import type { NextPage } from "next";
import { useContractRead, useContractReads } from "wagmi";
import HEXABI from "../lib/HEXABI.json";
import { useState } from "react";

const Home: NextPage = () => {
  const [stakeAddress, setStakeAddress] = useState("");
  const { data: stakeCount } = useContractRead({
    addressOrName: "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39",
    contractInterface: HEXABI,
    functionName: "stakeCount",
    args: stakeAddress,
  });

  const hexContract = {
    addressOrName: "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39",
    contractInterface: HEXABI,
  };

  const allStakes = Array.from(
    { length: Number(stakeCount) },
    (v, stakeIndex) => ({
      ...hexContract,
      functionName: "stakeLists",
      args: [stakeAddress, stakeIndex],
    })
  );
  const { data, isError, isLoading } = useContractReads({
    contracts: allStakes,
  });

  return (
    <div>
      <h3>{stakeAddress}</h3>
      <h4>{stakeCount?.toString()}</h4>
      <input
        type="text"
        value={stakeAddress}
        onChange={(e) => setStakeAddress(e.target.value)}
      />

      <h4>Stakes</h4>
      <ul>
        {data?.map((stake, index) => (
          <li key={index}>
            <div>{`${stake}`}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
