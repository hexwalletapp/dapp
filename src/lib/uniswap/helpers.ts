import { ChainId, UniswapPair } from "simple-uniswap-sdk";
import { HEX_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS } from "../constants";
import { provider } from "~/lib/provider";

export const getHexPrice = async () => {
  const uniswapPair = new UniswapPair({
    fromTokenContractAddress: HEX_CONTRACT_ADDRESS,
    toTokenContractAddress: USDC_CONTRACT_ADDRESS,
    ethereumAddress: "0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9",
    ethereumProvider: provider,
    chainId: ChainId.MAINNET,
  });

  const uniswapPairFactory = await uniswapPair.createFactory();

  return await uniswapPairFactory.trade("100");
};
