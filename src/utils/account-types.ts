export interface LineItem {
  name: string;
  valueUSD: string;
  valueHEX: string;
}

export interface Stake {
  stakeId: number;
  status: string;
  startDate: string;
  endDate: string;
  percentComplete: number;
  shares: string;
  lineItems: LineItem[];
}
