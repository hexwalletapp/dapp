import "~/styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiConfig, createClient, chain, configureChains } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { pulseChain } from "~/lib/pulsechain";
import Layout from "~/components/Layout";

const alchemyId = process.env.ALCHEMY_ID;

const { provider } = configureChains(
  [chain.mainnet, pulseChain],
  [alchemyProvider({ alchemyId }), publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider: provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </WagmiConfig>
  );
}

export default MyApp;
