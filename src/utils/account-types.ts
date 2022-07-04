export interface LineItem {
  isNewSection: boolean;
  name: string;
  valueUSD: number;
  valueHEX: number;
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
