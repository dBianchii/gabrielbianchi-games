import classNames from "classnames";
import { useState } from "react";
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

type Piece = {
  id: (typeof piecesIds)[number];
  svg: React.ReactElement;
};

const isOutOfBounds = (i: number, j: number) => {
  return i < 0 || i > 7 || j < 0 || j > 7;
};

function Game() {
  const [selectedCoords, setSelectedCoords] = useState<
    [number, number] | undefined
  >();

  const P: Piece = {
    id: "P",
    svg: <WhitePawn className="scale-[1.5]" />,
  };
  const R: Piece = { id: "R", svg: <WhiteRook className="scale-[1.5]" /> };
  const N: Piece = { id: "N", svg: <WhiteKnight className="scale-[1.5]" /> };
  const B: Piece = { id: "B", svg: <WhiteBishop className="scale-[1.5]" /> };
  const Q: Piece = { id: "Q", svg: <WhiteQueen className="scale-[1.5]" /> };
  const K: Piece = { id: "K", svg: <WhiteKing className="scale-[1.5]" /> };
  const p: Piece = { id: "p", svg: <BlackPawn className="scale-[1.5]" /> };
  const r: Piece = { id: "r", svg: <BlackRook className="scale-[1.5]" /> };
  const n: Piece = { id: "n", svg: <BlackKnight className="scale-[1.5]" /> };
  const b: Piece = { id: "b", svg: <BlackBishop className="scale-[1.5]" /> };
  const q: Piece = { id: "q", svg: <BlackQueen className="scale-[1.5]" /> };
  const k: Piece = { id: "k", svg: <BlackKing className="scale-[1.5]" /> };

  const board: (Piece | null)[][] = [
    [r, n, b, q, k, b, n, r],
    [p, p, p, p, p, p, p, p],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [P, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [P, P, P, P, P, P, P, P],
    [R, N, B, Q, K, B, N, R],
  ];

  const handleSelectPiece = ({ y, x }: { y: number; x: number }) => {
    setSelectedCoords([y, x]);
  };

  const hasPiece = (y: number, x: number) => {
    return board[y]?.[x] !== null;
  };

  const availableSquaresMoves: number[][] = [];
  {
    // Add logic to calculate available moves
    if (selectedCoords) {
      const selectedPiece = board[selectedCoords[0]]?.[selectedCoords[1]];
      if (!selectedPiece)
        throw new Error("Unreachable because we have a selected piece");

      //Let's separate the color from the id.
      const selectedPieceColor =
        selectedPiece.id === selectedPiece.id.toUpperCase() ? "white" : "black";
      const selectedPieceId = selectedPiece.id.toLowerCase();

      const u = selectedPieceColor === "white" ? -1 : 1;
      const [selectedY, selectedX] = selectedCoords;

      switch (selectedPieceId) {
        case "p": {
          const available = [
            [selectedY + u, selectedX],
            [selectedY + u + u, selectedX],
          ].filter(([y, x]) => {
            if (!y) throw new Error("Unreachable");
            if (!x) throw new Error("Unreachable");
            if (isOutOfBounds(y, x)) return false;

            return !hasPiece(y, x);
          });

          availableSquaresMoves.push(...available);
          break;
        }
      }
    }
  }

  return (
    <div className="flex flex-col">
      {board.map((row, y) => (
        <div className="flex" key={y}>
          {row.map((piece, x) => (
            <Square
              availableMove={availableSquaresMoves.some(
                ([x, y]) => x === y && y === x
              )}
              highlighted={
                selectedCoords &&
                selectedCoords[0] === y &&
                selectedCoords[1] === x
              }
              key={x + y}
              y={y}
              x={x}
              piece={piece}
              handleSelectPiece={handleSelectPiece}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function Square({
  y,
  x,
  piece,
  highlighted,
  handleSelectPiece,
  availableMove,
}: {
  y: number;
  x: number;
  piece: Piece | null;
  handleSelectPiece: (args: { y: number; x: number }) => void;
  highlighted?: boolean;
  availableMove: boolean;
}) {
  return (
    <div
      className={classNames(
        "flex h-20 w-20 items-center justify-center border-gray-400",
        {
          "bg-[#FBCC9C]": (y + x) % 2 === 0 && !highlighted,
          "bg-[#91602E]": (y + x) % 2 === 1 && !highlighted,
          "bg-yellow-500": highlighted,
          "bg-yellow-200": availableMove, // Add this line to indicate available move
        }
      )}
    >
      <div onClick={() => handleSelectPiece({ y, x })}>
        {piece && piece.svg}
      </div>
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
