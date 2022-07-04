import { useContractRead, useContractReads } from "wagmi";
import { hexContract } from "~/lib/constants";

export const useHexStakes = (stakeAddress: string, chainId: number) => {
  const { data: stakeCount, isLoading: stakeCountIsLoading } = useContractRead({
    ...hexContract,
    functionName: "stakeCount",
    args: stakeAddress,
    chainId: chainId,
  });

  const allStakes = Array.from(
    { length: Number(stakeCount) },
    (v, stakeIndex) => ({
      ...hexContract,
      functionName: "stakeLists",
      args: [stakeAddress, stakeIndex],
      chainId: chainId,
    })
  );

  const { data: stakes, isLoading: stakesAreLoading } = useContractReads({
    contracts: allStakes,
  });

  return {
    stakeCount: stakeCount,
    stakes: stakes,
    stakeCountIsLoading: stakeCountIsLoading,
    stakesAreLoading: stakesAreLoading,
  };
};
