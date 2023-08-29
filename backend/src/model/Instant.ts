export type Instant = {
  id: string;
  topic: string;
  price: number;
  total: number;
  releaseDate: string;
  closeDate: string;
  url: string;
  structure: { prize: number; count: number }[];
};
