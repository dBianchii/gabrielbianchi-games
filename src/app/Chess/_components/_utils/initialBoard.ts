import { b, B, k, K, n, N, p, P, q, Q, r, R, type Piece } from "./pieces";
export type Board = (Piece | null)[][];
const emptyRow = Array(8).fill(null) as Board[number];

export type Coord = { y: number; x: number };
export type Color = "white" | "black";

export const initialBoard: Board = [
  [r, n, b, q, k, b, n, r],
  [p, p, p, p, p, p, p, p],
  [...emptyRow],
  [...emptyRow],
  [...emptyRow],
  [...emptyRow],
  [P, P, P, P, P, P, P, P],
  [R, N, B, Q, K, B, N, R],
];
