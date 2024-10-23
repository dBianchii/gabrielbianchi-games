import Image from "next/image";

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

const pieceIdToSrcMap = {
  P: "/white-pawn",
  R: "/white-rook",
  N: "/white-knight",
  B: "/white-bishop",
  Q: "/white-queen",
  K: "/white-king",
  p: "/black-pawn",
  r: "/black-rook",
  n: "/black-knight",
  b: "/black-bishop",
  q: "/black-queen",
  k: "/black-king",
} as const;

export const PieceIMG = ({ pieceId }: { pieceId: keyof typeof pieceIds }) => {
  return (
    <Image
      alt=""
      src={`pieces/${pieceIdToSrcMap[pieceId]}.svg`}
      width={63}
      height={63}
    />
  );
};
