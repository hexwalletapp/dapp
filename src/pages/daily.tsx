import type { NextPage } from "next";
import { useContractRead } from "wagmi";
import { HEX_CONTRACT_ADDRESS } from "~/lib/constants";
import HEXABI from "~/abi/HEXABI.json";

const Daily: NextPage = () => {
  const { data: dailyDataRange } = useContractRead({
    addressOrName: HEX_CONTRACT_ADDRESS,
    contractInterface: HEXABI,
    functionName: "dailyDataRange",
    args: [0, 500],
  });

  const HEARTS_UINT_SHIFT = 72n;
  const HEARTS_MASK = (1n << HEARTS_UINT_SHIFT) - 1n;
  const SATS_UINT_SHIFT = 56n;
  const SATS_MASK = (1n << SATS_UINT_SHIFT) - 1n;
  const decodeDailyData = (encDay: BigInt) => {
    let v = BigInt(encDay.valueOf());
    let payout = v & HEARTS_MASK;
    v = v >> HEARTS_UINT_SHIFT;
    let shares = v & HEARTS_MASK;
    v = v >> HEARTS_UINT_SHIFT;
    let sats = v & SATS_MASK;
    return { payout, shares, sats };
  };

  const dailyDataDays = dailyDataRange?.map((dailyDataDay) => {
    return decodeDailyData(dailyDataDay);
  });

  return (
    <div>
      <h3>Daily Data</h3>
      <ol>
        {dailyDataDays?.map((dailyDataDay, index) => (
          <li key={index}>
            {`${dailyDataDay.payout} HEARTS (${dailyDataDay.shares} SHARES)`}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Daily;
