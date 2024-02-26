import { type Piece } from "./pieces";

export const isOutOfBounds = (i: number, j: number) => {
  return i < 0 || i > 7 || j < 0 || j > 7;
};

export const getPieceColor = (piece: Piece) =>
  piece.id === piece.id.toUpperCase() ? "white" : "black";

export const otherColor = (color: "white" | "black") =>
  color === "white" ? "black" : "white";
