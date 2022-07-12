import type { NextPage } from "next";
import type { Stake } from "utils/account-types";
import { useState, useEffect } from "react";
import { chain } from "wagmi";
import { useHexStakes } from "~/lib/hex";
import { StakeCard } from "~/components/ui/StakeCard";
import { BookmarkIcon, LinkIcon, StarIcon } from "@heroicons/react/outline";
import {
  ViewGridIcon,
  ViewListIcon,
  MenuAlt2Icon,
  DotsVerticalIcon,
  ViewGridAddIcon,
} from "@heroicons/react/solid";

const Accounts: NextPage = () => {
  const [stakeAddress, setStakeAddress] = useState("");
  const [disableFilters, setDisableFilters] = useState(true);

  const { stakeCount, stakes } = useHexStakes(stakeAddress, chain.mainnet.id);

  const verifyAndSetStakeAddress = (newStakeAddress: string) => {
    if (newStakeAddress !== stakeAddress) {
      setStakeAddress(newStakeAddress);
    }
  };

  useEffect(() => {
    if (disableFilters && stakes?.length > 0) {
      setDisableFilters(false);
    }
  }, [disableFilters, stakes]);

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
                value={stakeAddress}
                onChange={(e) =>
                  verifyAndSetStakeAddress(e.target.value.trim())
                }
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
                <option>Ethereum</option>
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
                <div className="grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                  {stakes?.map((stake: Stake, index: number) => (
                    <div key={index}>
                      <StakeCard stake={stake} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Accounts;
