import Head from "next/head";

const title = "HEX Wallet App";
const description =
  "HEX Wallet is an open source read-only app for telling the HEX story and tracking your financial future.";

const Meta = () => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Head>
  );
};

export default Meta;
