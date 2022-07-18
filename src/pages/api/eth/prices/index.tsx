import { NextApiRequest, NextApiResponse } from "next";
import { getHedronPrice, getHexPrice } from "~/lib/uniswap/helpers";

const Price = async (req: NextApiRequest, res: NextApiResponse) => {
  const hexTradePrice = await getHexPrice();
  const hdrnTradePrice = await getHedronPrice();

  const price = {
    hex:
      Number(hexTradePrice.expectedConvertQuote) /
      Number(hexTradePrice.baseConvertRequest),
    hdrn:
      Number(hdrnTradePrice.expectedConvertQuote) /
      Number(hdrnTradePrice.baseConvertRequest),
  };
  res.status(200).json(price);
};

export default Price;
