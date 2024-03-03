"use client";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import classNames from "classnames";
import { useEffect, useState } from "react";
import {
  initialBoard,
  type Board,
  type Color,
  type Coord,
} from "./_utils/initialBoard";
import { PieceSVG, type Piece } from "./_utils/pieces";
import {
  areThereAvailableMoves as hasAvailableMoves,
  getAvailableMoves,
  getKingCoords,
  getPiece,
  isKingInCheck,
  otherColor,
} from "./_utils/utils";

export function Game() {
  const [turn, setTurn] = useState<Color>("white");

  useEffect(() => {
    document.title = `Chess - ${turn}'s turn`;
    //play audio
  }, [turn]);
  const [board, setBoard] = useState(initialBoard);

  const [canCastle, setCanCastle] = useState({
    white: { king: true, queen: true },
    black: { king: true, queen: true },
  });
  const [selectedCoord, setSelectedCoord] = useState<
    { x: number; y: number } | undefined
  >();

  const kingCoords = getKingCoords(board, turn);
  const isInCheck = isKingInCheck({
    board,
    kingCoord: kingCoords,
    kingColor: turn,
  });

  if (!hasAvailableMoves({ board, turn, canCastle, doMove }))
    if (isInCheck) {
      alert("Checkmate");
    } else {
      alert("Stalemate");
    }

  const availableSquaresMoves: {
    y: number;
    x: number;
    condition?: () => boolean;
  }[] = [];

  // Add logic to calculate available moves
  if (selectedCoord) {
    const selectedPiece = board[selectedCoord.y]?.[selectedCoord.x];
    if (!selectedPiece)
      throw new Error("Selected piece is undefined but we have selectedCoords");

    availableSquaresMoves.push(
      ...getAvailableMoves({
        board,
        kingCoords,
        canCastle,
        selectedCoord: selectedCoord,
        turn,
        doMove,
      })
    );
  }

  const handleSelectSquare = ({ y, x }: { y: number; x: number }) => {
    if (selectedCoord) {
      if (
        (selectedCoord.x === x && selectedCoord.y === y) || //Same piece
        (!getPiece({ board, y, x }) &&
          !availableSquaresMoves.some(
            (coord) => coord.y === y && coord.x === x
          ))
      ) {
        setSelectedCoord(undefined);
        return;
      }

      if (
        availableSquaresMoves.some((coord) => coord.y === y && coord.x === x)
      ) {
        doMove({ coord: { y, x }, selectedCoord });
        setSelectedCoord(undefined);
        return;
      }

      const piece = getPiece({ board, y, x, color: turn });
      if (!piece) return;

      setSelectedCoord({ y, x });
    } else {
      const piece = getPiece({ board, y, x, color: turn });
      if (!piece) return;
      setSelectedCoord({ y, x });
    }
  };

  function doMove({
    coord,
    preview,
    selectedCoord,
  }: {
    coord: Coord;
    preview?: boolean;
    selectedCoord: Coord;
  }) {
    const piece = board[selectedCoord.y]?.[selectedCoord.x];

    const newBoard = JSON.parse(JSON.stringify(board)) as Board;

    newBoard[coord.y]![coord.x] = newBoard[selectedCoord.y]?.[selectedCoord.x]; //Move piece
    newBoard[selectedCoord.y]![selectedCoord.x] = undefined; //Remove piece from old position

    if (piece?.id.toLowerCase() === "k") {
      if ((canCastle[turn].queen || canCastle[turn].king) && !preview)
        setCanCastle((prev) => ({
          ...prev,
          [turn]: { king: false, queen: false },
        })); //Disable castling when king moves

      if (coord.x === selectedCoord.x - 2) {
        //Queen side castle
        newBoard[coord.y]![coord.x + 1] = newBoard[coord.y]![0]; //Move rook
        newBoard[coord.y]![0] = undefined; //Remove rook from old position
      }
      if (coord.x === selectedCoord.x + 2) {
        //King side castle
        newBoard[coord.y]![coord.x - 1] = newBoard[coord.y]![7]; //Move rook
        newBoard[coord.y]![7] = undefined; //Remove rook from old position
      }
    }

    if (piece?.id.toLowerCase() === "r" && !preview) {
      if (selectedCoord.x === 0 && canCastle[turn].queen)
        setCanCastle((prev) => ({
          ...prev,
          [turn]: { ...prev[turn], queen: false },
        }));
      if (selectedCoord.x === 7 && canCastle[turn].king)
        setCanCastle((prev) => ({
          ...prev,
          [turn]: { ...prev[turn], king: false },
        }));
    }

    if (preview) return newBoard;
    setBoard(newBoard);

    setTurn(otherColor(turn));
    return newBoard;
  }

  return (
    <div className="flex scale-50 flex-col md:scale-100">
      {board.map((row, y) => (
        <div className="flex" key={y}>
          {row.map((piece, x) => (
            <Square
              highlightRedSquare={
                isInCheck && kingCoords.y === y && kingCoords.x === x
              }
              availableMove={availableSquaresMoves.some(
                (coord) => coord.y === y && coord.x === x
              )}
              highlighted={
                selectedCoord && selectedCoord.y === y && selectedCoord.x === x
              }
              key={x + y}
              y={y}
              x={x}
              piece={piece}
              handleSelectPiece={handleSelectSquare}
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
  highlightRedSquare,
}: {
  y: number;
  x: number;
  piece: Piece | undefined;
  handleSelectPiece: (args: { y: number; x: number }) => void;
  highlighted?: boolean;
  availableMove: boolean;
  highlightRedSquare: boolean;
}) {
  return (
    <div
      onClick={() => handleSelectPiece({ y, x })}
      className={classNames(
        "flex h-20 w-20 items-center justify-center border-gray-400",
        {
          "bg-[#FBCC9C]": (y + x) % 2 === 0 && !highlighted,
          "bg-[#91602E]": (y + x) % 2 === 1 && !highlighted,
          "bg-yellow-500": highlighted,
          "bg-yellow-200": availableMove,
          "bg-red-500": highlightRedSquare,
        }
      )}
    >
      {piece && <PieceSVG pieceId={piece?.id} />}
    </div>
  );
}
