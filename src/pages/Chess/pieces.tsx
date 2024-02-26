import BlackBishop from "../../assets/pieces/black-bishop.svg";
import BlackKing from "../../assets/pieces/black-king.svg";
import BlackKnight from "../../assets/pieces/black-knight.svg";
import BlackPawn from "../../assets/pieces/black-pawn.svg";
import BlackQueen from "../../assets/pieces/black-queen.svg";
import BlackRook from "../../assets/pieces/black-rook.svg";
import WhiteBishop from "../../assets/pieces/white-bishop.svg";
import WhiteKing from "../../assets/pieces/white-king.svg";
import WhiteKnight from "../../assets/pieces/white-knight.svg";
import WhitePawn from "../../assets/pieces/white-pawn.svg";
import WhiteQueen from "../../assets/pieces/white-queen.svg";
import WhiteRook from "../../assets/pieces/white-rook.svg";

const piecesIds = [
  "P",
  "R",
  "N",
  "B",
  "Q",
  "K",
  "p",
  "r",
  "n",
  "b",
  "q",
  "k",
] as const;

export type Piece = {
  id: (typeof piecesIds)[number];
  svg: React.ReactElement;
};

const scale = "1.5";
export const P: Piece = {
  id: "P",
  svg: <WhitePawn className={`scale-[${scale}]`} />,
};
export const R: Piece = {
  id: "R",
  svg: <WhiteRook className={`scale-[${scale}]`} />,
};
export const N: Piece = {
  id: "N",
  svg: <WhiteKnight className={`scale-[${scale}]`} />,
};
export const B: Piece = {
  id: "B",
  svg: <WhiteBishop className={`scale-[${scale}]`} />,
};
export const Q: Piece = {
  id: "Q",
  svg: <WhiteQueen className={`scale-[${scale}]`} />,
};
export const K: Piece = {
  id: "K",
  svg: <WhiteKing className={`scale-[${scale}]`} />,
};
export const p: Piece = {
  id: "p",
  svg: <BlackPawn className={`scale-[${scale}]`} />,
};
export const r: Piece = {
  id: "r",
  svg: <BlackRook className={`scale-[${scale}]`} />,
};
export const n: Piece = {
  id: "n",
  svg: <BlackKnight className={`scale-[${scale}]`} />,
};
export const b: Piece = {
  id: "b",
  svg: <BlackBishop className={`scale-[${scale}]`} />,
};
export const q: Piece = {
  id: "q",
  svg: <BlackQueen className={`scale-[${scale}]`} />,
};
export const k: Piece = {
  id: "k",
  svg: <BlackKing className={`scale-[${scale}]`} />,
};
