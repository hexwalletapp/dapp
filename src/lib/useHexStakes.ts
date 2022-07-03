import { useContractRead, useContractReads } from "wagmi";
import HEXABI from "~/abi/HEXABI.json";

const useHexStakes = (stakeAddress: string, chainId: number) => {
  const { data: stakeCount } = useContractRead({
    addressOrName: "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39",
    contractInterface: HEXABI,
    functionName: "stakeCount",
    args: stakeAddress,
    chainId: chainId,
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
      chainId: chainId,
    })
  );

  const {
    data: stakes,
    isError,
    isLoading,
  } = useContractReads({
    contracts: allStakes,
  });

  return {
    stakeCount: stakeCount,
    stakes: stakes,
  };
};

export default useHexStakes;
