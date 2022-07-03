import "~/styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiConfig, createClient, chain, configureChains } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";

const alchemyId = process.env.ALCHEMY_ID;

const { provider } = configureChains(
  [chain.mainnet],
  [alchemyProvider({ alchemyId })]
);

const client = createClient({
  autoConnect: true,
  provider: provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
}

export default MyApp;
