import type { Stake, LineItem } from "utils/account-types";
import { heartsToHex } from "~/lib/converters";

export const StakeCard: React.FC<{ stake: Stake }> = ({ stake }) => {
  const total: LineItem = {
    name: "TOTAL",
    valueUSD: 100,
    valueHEX: 100,
  };

  const returnOnInvestment: LineItem = {
    name: "ROI",
    valueUSD: 100,
    valueHEX: 100,
  };

  const annualPercentageYield: LineItem = {
    name: "APY",
    valueUSD: 100,
    valueHEX: 100,
  };

  const TableLineItem: React.FC<{ lineItem: LineItem }> = ({ lineItem }) => {
    return (
      <tr className="border-b border-gray-50">
        <td className="py-4 pl-4 pr-3 text-sm sm:pl-6 md:pl-0">
          <div className="text-xs text-gray-400 small-caps">
            {lineItem.name}
          </div>
        </td>
        <td className="hidden py-4 px-3 text-right text-sm font-mono text-gray-600 sm:table-cell">
          {lineItem.valueUSD.toString()}
        </td>
        <td className="hidden py-4 px-3 text-right text-sm font-mono text-gray-600 sm:table-cell">
          {heartsToHex(lineItem.valueHEX).toString()}
        </td>
      </tr>
    );
  };

  return (
    <div className="card card-compact shadow-xl text-primary-content">
      <div className="card-body">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6 md:pl-0 card-title"
              ></th>
              <th
                scope="col"
                className="hidden py-3.5 px-3 text-right text-sm font-semibold text-gray-400 sm:table-cell small-caps"
              >
                USD
              </th>
              <th
                scope="col"
                className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-400 sm:pr-6 md:pr-0 small-caps"
              >
                HEX
              </th>
            </tr>
          </thead>

          <tbody>
            {stake.lineItems.map((lineItem: LineItem, index: number) => (
              <TableLineItem key={index} lineItem={lineItem} />
            ))}
          </tbody>
          <tfoot>
            <th
              className="border-b border-gray-300"
              scope="row"
              colSpan={3}
            ></th>
            <TableLineItem lineItem={total} />
            <th
              className="border-b border-gray-300"
              scope="row"
              colSpan={3}
            ></th>
            <TableLineItem lineItem={returnOnInvestment} />
            <TableLineItem lineItem={annualPercentageYield} />
          </tfoot>
        </table>
      </div>
    </div>
  );
};
