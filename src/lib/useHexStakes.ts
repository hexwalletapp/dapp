import { useContractRead, useContractReads } from "wagmi";
import { hexContract } from "~/lib/constants";

const useHexStakes = (stakeAddress: string, chainId: number) => {
  const { data: stakeCount } = useContractRead({
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
