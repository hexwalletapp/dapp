import type { Stake, LineItem } from "utils/account-types";

export const StakeCard: React.FC<{ stake: Stake }> = ({ stake }) => {
  const TableLineItem: React.FC<{ lineItem: LineItem }> = ({ lineItem }) => {
    return (
      <tr className="border-b border-gray-50">
        <td className="py-4 pl-4 pr-3 text-sm sm:pl-6 md:pl-0">
          <div className="text-xs text-gray-400 small-caps">
            {lineItem.name}
          </div>
        </td>
        <td className="py-4 px-3 text-right text-sm font-mono text-gray-600">
          {lineItem.valueUSD}
        </td>
        <td className="py-4 px-3 text-right text-sm font-mono text-gray-600">
          {lineItem.valueHEX}
        </td>
      </tr>
    );
  };

  const progressStyle: any = {
    "--value": stake.percentComplete,
  };

  return (
    <div className="card card-compact shadow-xl text-primary-content bg-white pt-4">
      <div className="card-body">
        <div className="flex flex-1">
          <div
            className="radial-progress text-primary --value:50;"
            style={progressStyle}
          >
            {`${stake.percentComplete}%`}
          </div>
          <div className="flex flex-1 flex-col min-w-0 flex-y-4">
            {/* <div className="text-base text-gray-900 text-right">
              {stake.status}
            </div> */}
            <p className="text-xl font-medium text-gray-900 text-right">
              {stake.shares}
            </p>
            <p className="text-base text-gray-500 truncate text-right">
              {stake.startDate} - {stake.endDate}
            </p>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6 md:pl-0 card-title"
              ></th>
              <th
                scope="col"
                className="py-3.5 px-3 text-right text-sm font-semibold text-gray-400 small-caps"
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
            {stake.lineItems
              .filter(
                (lineItem) =>
                  lineItem.name.toLowerCase() === "principal" ||
                  lineItem.name.toLowerCase() === "interest" ||
                  lineItem.name.toLowerCase() === "big pay day"
              )
              .map((lineItem: LineItem, index: number) => (
                <TableLineItem key={index} lineItem={lineItem} />
              ))}
          </tbody>
          <tfoot>
            <th
              className="border-b border-gray-300"
              scope="row"
              colSpan={3}
            ></th>
            {/* // where name is "TOTAL" */}
            {stake.lineItems
              .filter((lineItem) => lineItem.name.toLowerCase() === "total")
              .map((lineItem: LineItem, index: number) => (
                <TableLineItem key={index} lineItem={lineItem} />
              ))}
            <th
              className="border-b border-gray-300"
              scope="row"
              colSpan={3}
            ></th>
            {stake.lineItems
              .filter(
                (lineItem) =>
                  lineItem.name.toLowerCase() === "apy" ||
                  lineItem.name.toLowerCase() === "roi"
              )
              .map((lineItem: LineItem, index: number) => (
                <TableLineItem key={index} lineItem={lineItem} />
              ))}
          </tfoot>
        </table>
      </div>
    </div>
  );
};
