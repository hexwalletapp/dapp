import type { NextPage } from "next";
import { useContractRead } from "wagmi";
import HEXABI from "../lib/HEXABI.json";

const Home: NextPage = () => {
  const {
    data: totalSupply,
    isError,
    isLoading,
  } = useContractRead({
    addressOrName: "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39",
    contractInterface: HEXABI,
    functionName: "totalSupply",
  });

  return <div>{totalSupply?.toString()}</div>;
};

export default Home;
