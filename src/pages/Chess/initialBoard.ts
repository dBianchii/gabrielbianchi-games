import { b, B, k, K, n, N, p, P, q, Q, r, R, type Piece } from "./pieces";
const emptyRow = Array(8).fill(undefined) as (Piece | undefined)[];

export const initialBoard: (Piece | undefined)[][] = [
  [r, n, b, q, k, b, n, r],
  [p, p, p, p, p, p, p, p],
  emptyRow,
  emptyRow,
  emptyRow,
  emptyRow,
  [P, P, P, P, P, P, P, P],
  [R, N, B, Q, K, B, N, R],
];
