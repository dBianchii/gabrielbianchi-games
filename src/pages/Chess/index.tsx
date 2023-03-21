import classNames from "classnames";
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

function Game() {
  type Piece = {
    id: "P" | "R" | "N" | "B" | "Q" | "K" | "p" | "r" | "n" | "b" | "q" | "k";
    svg: React.ReactElement;
  };
  const P: Piece = {
    id: "P",
    svg: <WhitePawn />,
  };
  const R: Piece = { id: "R", svg: <WhiteRook width="200" height="200" /> };
  const N: Piece = { id: "N", svg: <WhiteKnight /> };
  const B: Piece = { id: "B", svg: <WhiteBishop /> };
  const Q: Piece = { id: "Q", svg: <WhiteQueen /> };
  const K: Piece = { id: "K", svg: <WhiteKing /> };
  const p: Piece = { id: "p", svg: <BlackPawn /> };
  const r: Piece = { id: "r", svg: <BlackRook /> };
  const n: Piece = { id: "n", svg: <BlackKnight /> };
  const b: Piece = { id: "b", svg: <BlackBishop /> };
  const q: Piece = { id: "q", svg: <BlackQueen /> };
  const k: Piece = { id: "k", svg: <BlackKing /> };

  const board: (Piece | null)[][] = [
    [r, n, b, q, k, b, n, r],
    [p, p, p, p, p, p, p, p],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [P, P, P, P, P, P, P, P],
    [R, N, B, Q, K, B, N, R],
  ];

  return (
    <div className="flex flex-col">
      {board.map((row, i) => (
        <div className="flex" key={i}>
          {row.map((piece, j) => (
            <div
              key={j}
              className={classNames("h-20 w-20 border-gray-400", {
                "bg-[#FBCC9C]": (i + j) % 2 === 0,
                "bg-[#91602E]": (i + j) % 2 === 1,
              })}
            >
              {piece && piece.svg}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Chess() {
  return (
    <div>
      <h1 className="text-5xl font-extrabold tracking-tight text-cyan-800 sm:text-[5rem]">
        Chess
      </h1>
      <Game />
    </div>
  );
}
