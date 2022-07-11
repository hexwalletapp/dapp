import { Fragment, useState, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  CreditCardIcon,
  FolderIcon,
  TrendingUpIcon,
  XIcon,
} from "@heroicons/react/outline";
import { SearchIcon } from "@heroicons/react/solid";

const navigation = [
  { name: "Search", href: "/", icon: SearchIcon, current: true },
  { name: "Charts", href: "/charts", icon: TrendingUpIcon, current: false },
  { name: "Accounts", href: "/accounts", icon: CreditCardIcon, current: false },
  { name: "Plans", href: "/plans", icon: FolderIcon, current: false },
];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const LeftNav = () => {
  return (
    <div className="drawer-side">
      <label htmlFor="hwa-drawer" className="drawer-overlay"></label>
      <ul className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
        {navigation.map((item, index) => (
          <li key={index}>
            <a href={item.href}>
              <item.icon
                className={classNames(
                  item.current
                    ? "text-gray-500"
                    : "text-gray-400 group-hover:text-gray-500",
                  "mr-3 flex-shrink-0 h-6 w-6"
                )}
                aria-hidden="true"
              />
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeftNav;
