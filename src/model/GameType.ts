export type Lottery = {
  label: string;
  code: string;
};

export type Instant = {
  id: number;
  topic: string;
  cost: number;
  total: number;
  releaseDate: string;
  structure: {
    prize: number;
    howMany: number;
  }[];
};
