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
import { BookmarkIcon, MenuAlt2Icon } from "@heroicons/react/outline";
import { SearchIcon } from "@heroicons/react/solid";
import SideMenuContext from "~/contexts/SideMenuContext";

const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Accounts: NextPage = () => {
  const { setSidebarOpen } = useContext(SideMenuContext);
  const [hexPrice, setHexPrice] = useState<number>(0);
  const [stakeAddress, setStakeAddress] = useState("");
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
      valueUSD: "$" + format(principalUSD),
      valueHEX: format(principalHEX),
    };

    // Interest
    const interestHearts =
      interestForRange(stakeDailyDataDays, BigInt(stake.stakeShares)) ?? 0;
    const interestHEX = heartsToHex(Number(interestHearts));
    const interestUSD = interestHEX * hexPrice;
    const interest: LineItem = {
      name: "INTEREST",
      valueUSD: "$" + format(interestUSD),
      valueHEX: format(interestHEX),
    };

    // Big Pay Day
    const bigPayDayHearts = getBigPayDayBonus(
      stake.lockedDay,
      stake.stakedDays,
      BigInt(stake.stakeShares)
    );
    const bigPayDayHEX = heartsToHex(Number(bigPayDayHearts));
    const bigPayDay: LineItem = {
      name: "BIG PAY DAY",
      valueUSD: "$" + format(bigPayDayHEX * hexPrice),
      valueHEX: format(bigPayDayHEX),
    };

    // Total
    const totalHEX = principalHEX + interestHEX + bigPayDayHEX;
    const totalUSD = totalHEX * hexPrice;
    const total: LineItem = {
      name: "TOTAL",
      valueUSD: "$" + format(totalUSD),
      valueHEX: format(totalHEX),
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
    const fetchData = async () => {
      const trade = await getHexPrice();
      setHexPrice(
        Number(trade.expectedConvertQuote) / Number(trade.baseConvertRequest)
      );
    };
    fetchData();
  }, [stakes]);

  return (
    <>
      <div>
        <div className="md:pl-64 flex flex-col flex-1">
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
            <button
              type="button"
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-1 px-4 flex justify-between">
              <div className="flex-1 flex">
                <form className="w-full flex md:ml-0" action="#" method="GET">
                  <label htmlFor="search-field" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                      <SearchIcon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <input
                      id="search-field"
                      className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                      placeholder="0x..."
                      type="search"
                      name="search"
                      onChange={(e) => setStakeAddress(e.target.value.trim())}
                    />
                  </div>
                </form>
              </div>
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  type="button"
                  className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">Bookmark</span>
                  <BookmarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <a
                              href={item.href}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              {item.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <main className="flex-1">
            <div className="py-6">
              <div className="px-4 sm:px-6 md:px-8">
                {/* Replace with your content */}
                <div className="grid lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
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
