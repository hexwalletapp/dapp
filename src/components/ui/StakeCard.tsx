import type { Stake, LineItem } from "utils/account-types";

export const StakeCard: React.FC<{ stake: Stake }> = ({ stake }) => {
  const TableLineItem: React.FC<{ lineItem: LineItem }> = ({ lineItem }) => {
    return (
      <tr>
        <td className="py-4 pl-4 pr-3 text-sm sm:pl-6 md:pl-0">
          <div className="text-xs small-caps truncate">{lineItem.name}</div>
        </td>
        <td className="py-4 px-3 text-right text-sm font-mono">
          {lineItem.valueUSD}
        </td>
        <td className="py-4 px-3 text-right text-sm font-mono">
          {lineItem.valueHEX}
        </td>
      </tr>
    );
  };

  const progressStyle: any = {
    "--value": stake.percentComplete,
  };

  return (
    <div className="card card-compact shadow-xl bg-base-100 pt-6">
      <div className="card-body">
        <div className="flex flex-1">
          <div className="radial-progress text-primary" style={progressStyle}>
            {`${stake.percentComplete}%`}
          </div>
          <div className="flex flex-1 flex-col min-w-0 flex-y-4">
            <p className="text-xl font-medium text-right">{stake.shares}</p>
            <p className="text-base truncate text-right">
              {stake.startDate} - {stake.endDate}
            </p>
          </div>
        </div>

        <table className="min-w-full divide-y">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6 md:pl-0 card-title"
              ></th>
              <th
                scope="col"
                className="py-3.5 px-3 text-right text-sm font-semibold small-caps"
              >
                USD
              </th>
              <th
                scope="col"
                className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold sm:pr-6 md:pr-0 small-caps"
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
                  lineItem.name.toLowerCase() === "bpd"
              )
              .map((lineItem: LineItem, index: number) => (
                <TableLineItem key={index} lineItem={lineItem} />
              ))}
          </tbody>
          <tfoot>
            {stake.lineItems
              .filter((lineItem) => lineItem.name.toLowerCase() === "total")
              .map((lineItem: LineItem, index: number) => (
                <TableLineItem key={index} lineItem={lineItem} />
              ))}
            <th className="border-b" scope="row" colSpan={3}></th>
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
