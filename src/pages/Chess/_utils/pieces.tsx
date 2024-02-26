import BlackBishop from "../../../assets/pieces/black-bishop.svg";
import BlackKing from "../../../assets/pieces/black-king.svg";
import BlackKnight from "../../../assets/pieces/black-knight.svg";
import BlackPawn from "../../../assets/pieces/black-pawn.svg";
import BlackQueen from "../../../assets/pieces/black-queen.svg";
import BlackRook from "../../../assets/pieces/black-rook.svg";
import WhiteBishop from "../../../assets/pieces/white-bishop.svg";
import WhiteKing from "../../../assets/pieces/white-king.svg";
import WhiteKnight from "../../../assets/pieces/white-knight.svg";
import WhitePawn from "../../../assets/pieces/white-pawn.svg";
import WhiteQueen from "../../../assets/pieces/white-queen.svg";
import WhiteRook from "../../../assets/pieces/white-rook.svg";

const pieceIds = {
  P: "P",
  R: "R",
  N: "N",
  B: "B",
  Q: "Q",
  K: "K",
  p: "p",
  r: "r",
  n: "n",
  b: "b",
  q: "q",
  k: "k",
} as const;

export type Piece = {
  id: keyof typeof pieceIds;
  svg: React.ReactElement;
};

const scale = "scale-[1.5]";
export const P: Piece = {
  id: pieceIds.P,
  svg: <WhitePawn className={`${scale}`} />,
};
export const R: Piece = {
  id: pieceIds.R,
  svg: <WhiteRook className={`${scale}`} />,
};
export const N: Piece = {
  id: pieceIds.N,
  svg: <WhiteKnight className={`${scale}`} />,
};
export const B: Piece = {
  id: pieceIds.B,
  svg: <WhiteBishop className={`${scale}`} />,
};
export const Q: Piece = {
  id: pieceIds.Q,
  svg: <WhiteQueen className={`${scale}`} />,
};
export const K: Piece = {
  id: pieceIds.K,
  svg: <WhiteKing className={`${scale}`} />,
};
export const p: Piece = {
  id: pieceIds.p,
  svg: <BlackPawn className={`${scale}`} />,
};
export const r: Piece = {
  id: pieceIds.r,
  svg: <BlackRook className={`${scale}`} />,
};
export const n: Piece = {
  id: pieceIds.n,
  svg: <BlackKnight className={`${scale}`} />,
};
export const b: Piece = {
  id: pieceIds.b,
  svg: <BlackBishop className={`${scale}`} />,
};
export const q: Piece = {
  id: pieceIds.q,
  svg: <BlackQueen className={`${scale}`} />,
};
export const k: Piece = {
  id: pieceIds.k,
  svg: <BlackKing className={`${scale}`} />,
};
