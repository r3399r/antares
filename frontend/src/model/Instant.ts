export type Instant = {
  id: string;
  topic: string;
  price: number;
  total: number;
  releasedAt: string;
  closedAt: string;
  picUrl: string;
  structure: { prize: number; count: number }[];
};

export type InstantStat = {
  id: string;
  topic: string;
  price: number;
  totalW: number;
  total: number;
  totalR: number;
  bingoRate: number;
  winRate: number;
  noLoseRate: number;
  expect: number;
  expectWin: number;
  expectLose: number;
  winLoseRatio: number;
  topPrize: number;
  topCount: number;
  releasedAt: string;
  closedAt: string;
  structure: { prize: number; count: number }[];
};
