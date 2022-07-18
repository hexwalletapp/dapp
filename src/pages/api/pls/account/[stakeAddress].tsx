import { NextApiRequest, NextApiResponse } from "next";

const Account = async (req: NextApiRequest, res: NextApiResponse) => {
  const { stakeAddress } = req.query as { stakeAddress: string };

  res.status(200).json({ Hello: "World" });
};

export default Account;
