export interface LineItem {
  name: string;
  valueUSD: string;
  valueHEX: string;
}

export interface Stake {
  stakeId: number;
  status: string;
  startDate: number;
  endDate: number;
  percentComplete: number;
  shares: number;
  lineItems: LineItem[];
}
