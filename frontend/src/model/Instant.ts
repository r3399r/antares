export type Instant = {
  id: string;
  topic: string;
  price: number;
  total: number;
  releasedAt: string;
  closedAt: string;
  exchangeLastDate: string | null;
  picPath: string;
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
  exchangeLastDate: string | null;
  picPath: string;
  /** Off sale: the lottery stopped selling it before today. Resolved at build time. */
  isExpired: boolean;
  structure: { prize: number; count: number }[];
};

/** The fields a link to another card needs; keeps page props small. */
export type InstantLink = Pick<
  InstantStat,
  'id' | 'topic' | 'price' | 'bingoRate' | 'expect' | 'closedAt' | 'isExpired'
>;

export const toInstantLink = ({
  id,
  topic,
  price,
  bingoRate,
  expect,
  closedAt,
  isExpired,
}: InstantStat): InstantLink => ({ id, topic, price, bingoRate, expect, closedAt, isExpired });
