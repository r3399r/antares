export type PostInstantRequest = {
  serial: string;
  topic: string;
  cost: number;
  total: number;
  releasedAt: string;
  closedAt: string;
  structure: {
    prize: number;
    count: number;
  }[];
};

export type GetInstantResponse = {
  id: string;
  serial: string;
  topic: string;
  cost: number;
  total: number;
  releasedAt: string;
  closedAt: string;
  structure: {
    id: string;
    prize: number;
    count: number;
  }[];
}[];
