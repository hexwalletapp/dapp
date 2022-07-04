import { constants } from "ethers";
import {
  HEARTS_MASK,
  HEARTS_UINT_SHIFT,
  SATS_MASK,
  BIG_PAY_DAY,
  BPD_UNCLAIMED_SATS,
  HEARTS_PER_SATOSHI,
  BPD_TOTAL_SHARES,
  CLAIMED_SATS,
  CLAIMABLE_SATS_TOTAL,
  CLAIMED_ADDR_COUNT,
  CLAIMABLE_ADDR_COUNT,
} from "~/lib/constants";

const decodeDailyData = (encDay: BigInt) => {
  let v = BigInt(encDay.valueOf());
  let payout = v & HEARTS_MASK;
  v = v >> HEARTS_UINT_SHIFT;
  let shares = v & HEARTS_MASK;
  v = v >> HEARTS_UINT_SHIFT;
  let sats = v & SATS_MASK;
  return { payout, shares, sats };
};

const getBigPayDayBonus = (
  startDay: number,
  stakedDays: number,
  shares: bigint
) => {
  if (startDay > BIG_PAY_DAY || startDay + stakedDays <= BIG_PAY_DAY)
    return constants.Zero;

  const directBonus =
    (BPD_UNCLAIMED_SATS * HEARTS_PER_SATOSHI * shares) / BPD_TOTAL_SHARES;
  const viralRewards =
    (directBonus * CLAIMED_ADDR_COUNT) / CLAIMABLE_ADDR_COUNT;
  const criticalMass = (directBonus * CLAIMED_SATS) / CLAIMABLE_SATS_TOTAL;

  return viralRewards + criticalMass;
};

const interestForRange = (dailyData: any, myShares: any) => {
  return dailyData?.reduce(
    (s: any, d: any) => s + interestForDay(d, myShares),
    0n
  );
};

const interestForDay = (dayObj: any, myShares: any) => {
  return (myShares * dayObj.payout) / dayObj.shares;
};

export { decodeDailyData, getBigPayDayBonus, interestForRange };
