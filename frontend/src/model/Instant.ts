export type Instant = {
  id: string;
  topic: string;
  cost: number;
  total: number;
  closeDate: string;
  structure: { prize: number; count: number }[];
};

export type InstantStat = {
  id: string;
  topic: string;
  cost: number;
  totalW: number;
  totalR: number;
  bingoRate: number;
  winRate: number;
  noLoseRate: number;
  expect: number;
  topPrize: number;
  topCount: number;
  closeDate: string;
};