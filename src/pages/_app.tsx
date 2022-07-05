import "~/styles/main.css";
import type { AppProps } from "next/app";
import { WagmiConfig, createClient } from "wagmi";
import Layout from "~/components/Layout";
import { provider } from "~/lib/provider";

const client = createClient({
  autoConnect: true,
  provider: provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <Layout>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />

        <Component {...pageProps} />
      </Layout>
    </WagmiConfig>
  );
}

export default MyApp;
