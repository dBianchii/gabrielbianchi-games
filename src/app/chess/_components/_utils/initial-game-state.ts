import { LiveList, LiveObject } from "@liveblocks/client";
import { b, B, k, K, n, N, p, P, q, Q, r, R, type Piece } from "./pieces";
export type Board = (Piece | null)[][];
const emptyRow = [null, null, null, null, null, null, null, null];
export type Coord = { y: number; x: number };
export type Color = "white" | "black";

export const initialBoard: LiveList<LiveList<Piece | null>> = new LiveList([
  new LiveList([r, n, b, q, k, b, n, r]),
  new LiveList([p, p, p, p, p, p, p, p]),
  new LiveList([...emptyRow]),
  new LiveList([...emptyRow]),
  new LiveList([...emptyRow]),
  new LiveList([...emptyRow]),
  new LiveList([P, P, P, P, P, P, P, P]),
  new LiveList([R, N, B, Q, K, B, N, R]),
]);
export const initialTurn = new LiveObject({ color: "white" as const });
export const initialCastling = new LiveObject({
  white: new LiveObject({ king: true, queen: true }),
  black: new LiveObject({ king: true, queen: true }),
});

export const convertToBoard = (liveBoard: LiveList<LiveList<Piece | null>>) => {
  return liveBoard.map((row) => row.toArray());
};
