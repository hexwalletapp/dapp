import type { NextPage } from "next";
import { useContractRead } from "wagmi";
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

  return (
    <div>
      <h3>{stakeAddress}</h3>
      <h4>{stakeCount?.toString()}</h4>
      <input
        type="text"
        value={stakeAddress}
        onChange={(e) => setStakeAddress(e.target.value)}
      />
    </div>
  );
};

export default Home;
