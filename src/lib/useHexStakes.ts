import { useContractRead, useContractReads } from "wagmi";
import HEXABI from "~/abi/HEXABI.json";
import { HEX_CONTRACT_ADDRESS } from "~/lib/constants";

const useHexStakes = (stakeAddress: string, chainId: number) => {
  const { data: stakeCount } = useContractRead({
    addressOrName: HEX_CONTRACT_ADDRESS,
    contractInterface: HEXABI,
    functionName: "stakeCount",
    args: stakeAddress,
    chainId: chainId,
  });

  const hexContract = {
    addressOrName: HEX_CONTRACT_ADDRESS,
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
