import BlackBishop from "../../../../assets/pieces/black-bishop.svg";
import BlackKing from "../../../../assets/pieces/black-king.svg";
import BlackKnight from "../../../../assets/pieces/black-knight.svg";
import BlackPawn from "../../../../assets/pieces/black-pawn.svg";
import BlackQueen from "../../../../assets/pieces/black-queen.svg";
import BlackRook from "../../../../assets/pieces/black-rook.svg";
import WhiteBishop from "../../../../assets/pieces/white-bishop.svg";
import WhiteKing from "../../../../assets/pieces/white-king.svg";
import WhiteKnight from "../../../../assets/pieces/white-knight.svg";
import WhitePawn from "../../../../assets/pieces/white-pawn.svg";
import WhiteQueen from "../../../../assets/pieces/white-queen.svg";
import WhiteRook from "../../../../assets/pieces/white-rook.svg";

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
};

const scale = "scale-[1.5]";
export const P: Piece = {
  id: pieceIds.P,
};
export const R: Piece = {
  id: pieceIds.R,
};
export const N: Piece = {
  id: pieceIds.N,
};
export const B: Piece = {
  id: pieceIds.B,
};
export const Q: Piece = {
  id: pieceIds.Q,
};
export const K: Piece = {
  id: pieceIds.K,
};
export const p: Piece = {
  id: pieceIds.p,
};
export const r: Piece = {
  id: pieceIds.r,
};
export const n: Piece = {
  id: pieceIds.n,
};
export const b: Piece = {
  id: pieceIds.b,
};
export const q: Piece = {
  id: pieceIds.q,
};
export const k: Piece = {
  id: pieceIds.k,
};

export const PieceSVG = ({ pieceId }: { pieceId: keyof typeof pieceIds }) => {
  const pieceIdToSVGMap = {
    P: <WhitePawn className={`${scale}`} />,
    R: <WhiteRook className={`${scale}`} />,
    N: <WhiteKnight className={`${scale}`} />,
    B: <WhiteBishop className={`${scale}`} />,
    Q: <WhiteQueen className={`${scale}`} />,
    K: <WhiteKing className={`${scale}`} />,
    p: <BlackPawn className={`${scale}`} />,
    r: <BlackRook className={`${scale}`} />,
    n: <BlackKnight className={`${scale}`} />,
    b: <BlackBishop className={`${scale}`} />,
    q: <BlackQueen className={`${scale}`} />,
    k: <BlackKing className={`${scale}`} />,
  } as const;
  return pieceIdToSVGMap[pieceId];
};
