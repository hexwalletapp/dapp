import { chain, configureChains } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { pulseChain } from "~/lib/pulsechain";
const alchemyId = process.env.ALCHEMY_ID;

const { provider } = configureChains(
  [chain.mainnet, pulseChain],
  [alchemyProvider({ alchemyId }), publicProvider()]
);

export { provider };
