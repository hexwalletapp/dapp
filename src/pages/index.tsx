import type { NextPage } from "next";
import type { Stake, LineItem } from "utils/account-types";
import { Fragment, useState, useContext, useEffect } from "react";
import { chain } from "wagmi";
import { useHexDailyData, useHexStakes } from "~/lib/hex";
import { getHexPrice } from "~/lib/uniswap/helpers";
import { getBigPayDayBonus, interestForRange } from "~/lib/hex/helpers";
import { StakeCard } from "~/components/ui/StakeCard";
import {
  heartsToHex,
  format,
  formatPercent,
  dayToFormattedDate,
  sharesToSI,
} from "~/lib/utils";
import { Menu, Transition } from "@headlessui/react";
import { BookmarkIcon, LinkIcon, StarIcon } from "@heroicons/react/outline";
import {
  ViewGridIcon,
  ViewListIcon,
  MenuAlt2Icon,
  DotsVerticalIcon,
  ViewGridAddIcon,
} from "@heroicons/react/solid";

const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

const Accounts: NextPage = () => {
  const [hexPrice, setHexPrice] = useState<number>(0);
  const [stakeAddress, setStakeAddress] = useState("");
  const [disableFilters, setDisableFilters] = useState(true);
  const { currentDay, dailyDataDays } = useHexDailyData(chain.mainnet.id);
  const { stakeCount: stakeCountETH, stakes: stakesETH } = useHexStakes(
    stakeAddress,
    chain.mainnet.id
  );

  const stakes = stakesETH?.map((stake: any) => {
    const daysStaked = currentDay - Number(stake.lockedDay);
    const stakeDailyDataDays = dailyDataDays?.slice(
      stake.lockedDay,
      stake.lockedDay + stake.stakedDays
    );

    // Principal
    const principalHEX = heartsToHex(Number(stake.stakeShares));
    const principalUSD = principalHEX * hexPrice;
    const principal: LineItem = {
      name: "PRINCIPAL",
      valueUSD: "$" + format(principalUSD, 2),
      valueHEX: format(principalHEX, 0),
    };

    // Interest
    const interestHearts =
      interestForRange(stakeDailyDataDays, BigInt(stake.stakeShares)) ?? 0;
    const interestHEX = heartsToHex(Number(interestHearts));
    const interestUSD = interestHEX * hexPrice;
    const interest: LineItem = {
      name: "INTEREST",
      valueUSD: "$" + format(interestUSD, 2),
      valueHEX: format(interestHEX, 0),
    };

    // Big Pay Day
    const bigPayDayHearts = getBigPayDayBonus(
      stake.lockedDay,
      stake.stakedDays,
      BigInt(stake.stakeShares)
    );
    const bigPayDayHEX = heartsToHex(Number(bigPayDayHearts));
    const bigPayDay: LineItem = {
      name: "BPD",
      valueUSD: "$" + format(bigPayDayHEX * hexPrice, 2),
      valueHEX: format(bigPayDayHEX, 0),
    };

    // Total
    const totalHEX = principalHEX + interestHEX + bigPayDayHEX;
    const totalUSD = totalHEX * hexPrice;
    const total: LineItem = {
      name: "TOTAL",
      valueUSD: "$" + format(totalUSD, 2),
      valueHEX: format(totalHEX, 0),
    };

    // ROI
    const roiHEX = interestHEX / principalHEX;
    const roiUSD = interestUSD / principalUSD;
    const roi: LineItem = {
      name: "ROI",
      valueUSD: formatPercent(roiUSD),
      valueHEX: formatPercent(roiHEX),
    };

    // APY
    const apyHEX = (roiHEX * 365) / daysStaked;
    const apyUSD = (roiUSD * 365) / daysStaked;
    const apy: LineItem = {
      name: "APY",
      valueUSD: formatPercent(apyUSD),
      valueHEX: formatPercent(apyHEX),
    };

    const percentComplete = Number(
      format(((currentDay - stake.lockedDay) / stake.stakedDays) * 100, 1)
    );
    const currentStake: Stake = {
      stakeId: stake.stakeId,
      status: "active",
      startDate: dayToFormattedDate(stake.lockedDay),
      endDate: dayToFormattedDate(stake.lockedDay + stake.stakedDays),
      percentComplete: percentComplete,
      shares: sharesToSI(stake.stakeShares),
      lineItems: [principal, interest, bigPayDay, total, roi, apy],
    };
    return currentStake;
  });

  useEffect(() => {
    if (stakes && stakes?.length > 0) {
      setDisableFilters(false);
    }
    const fetchData = async () => {
      const trade = await getHexPrice();
      setHexPrice(
        Number(trade.expectedConvertQuote) / Number(trade.baseConvertRequest)
      );
    };
    fetchData();
  }, [stakes, setDisableFilters]);

  return (
    <>
      <div>
        <div className="flex flex-col flex-1">
          <div className="navbar py-4 px-4 sm:px-6 md:pl-2">
            <div className="flex-1 flex space-x-4 pr-4">
              <label
                htmlFor="hwa-drawer"
                className="btn btn-primary shadow-lg drawer-button lg:hidden"
              >
                <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
              </label>

              <input
                title="Stake Address"
                className="input shadow-lg w-full max-w-md"
                type="text"
                placeholder="0x..."
                autoComplete="off"
                autoCapitalize="off"
                // autoCorrect="off"
                value={stakeAddress}
                onChange={(e) => setStakeAddress(e.target.value.trim())}
              />
            </div>
            <div className="flex-none flex space-x-4">
              <div className="dropdown dropdown-end lg:hidden">
                <label tabIndex={0} className="btn m-1 shadow-xl ">
                  <DotsVerticalIcon className="h-6 w-6" />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box"
                >
                  <li className="disabled">
                    <label>
                      <LinkIcon className="h-6 w-6" aria-hidden="true" />
                      Chain
                    </label>
                    <ul className="-ml-64 p-2 shadow bg-base-100 rounded-box">
                      <li>
                        <a>Ethereum</a>
                      </li>
                      <li>
                        <a>PulseChain</a>
                      </li>
                    </ul>
                  </li>
                  <li className="disabled">
                    <a className="gap-2">
                      <BookmarkIcon className="h-6 w-6" aria-hidden="true" />
                      Bookmark
                    </a>
                  </li>
                  <li className="disabled">
                    <a className="gap-2">
                      <StarIcon className="h-6 w-6" aria-hidden="true" />
                      Favorite
                    </a>
                  </li>
                  <li className="disabled">
                    <span>
                      <ViewGridIcon className="h-6 w-6" aria-hidden="true" />
                      Grid
                    </span>
                    <ul className="-ml-64 p-2 shadow bg-base-100 rounded-box">
                      <li>
                        <a>
                          <ViewGridAddIcon
                            className="h-6 w-6"
                            aria-hidden="true"
                          />
                          Grid
                        </a>
                      </li>
                      <li>
                        <a>
                          <ViewListIcon
                            className="h-6 w-6"
                            aria-hidden="true"
                          />
                          List
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              <select className="select max-w-xs menu-extra-action">
                <option selected>Ethereum</option>
                <option>Pulse</option>
              </select>

              <button
                className="btn menu-extra-action"
                disabled={disableFilters}
              >
                <BookmarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              <button
                className="btn menu-extra-action"
                disabled={disableFilters}
              >
                <StarIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              <div className="btn-group menu-extra-action">
                <button className="btn btn-active" disabled={disableFilters}>
                  <ViewGridIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                <button className="btn" disabled={disableFilters}>
                  <ViewListIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <main className="flex-1">
            <div className="py-6">
              <div className="px-4 sm:px-6 md:px-6">
                {/* Replace with your content */}
                <div className="grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                  {stakes?.map((stake: Stake, index: number) => (
                    <div key={index}>
                      <StakeCard stake={stake} />
                    </div>
                  ))}
                </div>
                {/* /End replace */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Accounts;
