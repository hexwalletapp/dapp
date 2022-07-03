import type { NextPage } from "next";
import { pulseChain } from "~/lib/pulsechain";
import { chain } from "wagmi";
import { useHexDailyData } from "~/lib/useHexDailyData";

const Daily: NextPage = () => {
  const { currentDay: currentDayETH, dailyDataDays: dailyDataDaysETH } =
    useHexDailyData(chain.mainnet.id);
  const { currentDay: currentDayPLS, dailyDataDays: dailyDataDaysPLS } =
    useHexDailyData(pulseChain.id);

  return (
    <div>
      <h3>Daily Data - ETH ({`${currentDayETH?.toString()}`})</h3>
      <ol>
        {dailyDataDaysETH?.map((dailyDataDay, index) => (
          <li key={index}>
            {`${dailyDataDay.payout} HEARTS (${dailyDataDay.shares} SHARES)`}
          </li>
        ))}
      </ol>

      <h3>Daily Data - PLS ({`${currentDayPLS?.toString()}`})</h3>
      <ol>
        {dailyDataDaysPLS?.map((dailyDataDay, index) => (
          <li key={index}>
            {`${dailyDataDay.payout} HEARTS (${dailyDataDay.shares} SHARES)`}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Daily;
