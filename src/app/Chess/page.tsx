"use client";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import classNames from "classnames";
import { useEffect, useState } from "react";
import { initialBoard } from "./_utils/initialBoard";
import { type Piece } from "./_utils/pieces";
import { getPiece, isInCheck, otherColor, pieceColor } from "./_utils/utils";

function Game({
  turn,
  setTurn,
}: {
  turn: "white" | "black";
  setTurn: (turn: "white" | "black") => void;
}) {
  const [board, setBoard] = useState(initialBoard);

  const [canCastle, setCanCastle] = useState({
    white: { king: true, queen: true },
    black: { king: true, queen: true },
  });
  const [selectedCoords, setSelectedCoords] = useState<
    { x: number; y: number } | undefined
  >();

  const availableSquaresMoves: {
    y: number;
    x: number;
    condition?: () => boolean;
  }[] = [];
  // Add logic to calculate available moves
  if (selectedCoords) {
    const selectedPiece = board[selectedCoords.y]?.[selectedCoords.x];
    if (!selectedPiece)
      throw new Error("Selected piece is undefined but we have selectedCoords");

    //Let's separate the color from the id.
    const selectedPieceColor = pieceColor(selectedPiece);

    const { y: selectedY, x: selectedX } = selectedCoords;

    const doCoordinateCheck = (y: number, x: number) => {
      // if (isOutOfBounds(y, x)) return true;
      if (getPiece({ board, y, x })) {
        if (getPiece({ board, y, x, color: otherColor(selectedPieceColor) }))
          availableSquaresMoves.push({ y, x }); //Capture
        return true;
      }

      availableSquaresMoves.push({ y, x });
      return false;
    };

    switch (selectedPiece.id.toLowerCase()) {
      case "p": {
        const u = selectedPieceColor === "white" ? -1 : 1; //?Up or down
        availableSquaresMoves.push(
          ...[
            {
              //Move forward
              y: selectedY + u,
              x: selectedX,
              condition: () =>
                !!!getPiece({ board, y: selectedY + u, x: selectedX }),
            },
            {
              //Move forward 2
              y: selectedY + u + u,
              x: selectedX,
              condition: () =>
                (selectedY === 1 || selectedY === 6) &&
                !!!getPiece({ board, y: selectedY + u, x: selectedX }) &&
                !!!getPiece({ board, y: selectedY + u + u, x: selectedX }),
            },
            {
              //Capture
              y: selectedY + u,
              x: selectedX - 1,
              condition: () =>
                !!getPiece({
                  board,
                  y: selectedY + u,
                  x: selectedX - 1,
                  color: otherColor(selectedPieceColor),
                }),
            },
            {
              //Capture
              y: selectedY + u,
              x: selectedX + 1,
              condition: () =>
                !!getPiece({
                  board,
                  y: selectedY + u,
                  x: selectedX + 1,
                  color: otherColor(selectedPieceColor),
                }),
            },
          ].filter(({ condition }) => {
            // if (isOutOfBounds(y, x)) return false;
            if (condition && !condition()) return false;

            return true;
          })
        );
        break;
      }
      case "r": {
        let stopUp = false;
        let stopDown = false;
        let stopRight = false;
        let stopLeft = false;

        for (let i = 1; i < 8; i++) {
          if (!stopUp) stopUp = doCoordinateCheck(selectedY - i, selectedX);
          if (!stopDown) stopDown = doCoordinateCheck(selectedY + i, selectedX);
          if (!stopRight)
            stopRight = doCoordinateCheck(selectedY, selectedX + i);
          if (!stopLeft) stopLeft = doCoordinateCheck(selectedY, selectedX - i);
        }
        break;
      }
      case "n": {
        const possibleMoves = [
          { y: selectedY - 2, x: selectedX - 1 },
          { y: selectedY - 2, x: selectedX + 1 },
          { y: selectedY - 1, x: selectedX - 2 },
          { y: selectedY - 1, x: selectedX + 2 },
          { y: selectedY + 1, x: selectedX - 2 },
          { y: selectedY + 1, x: selectedX + 2 },
          { y: selectedY + 2, x: selectedX - 1 },
          { y: selectedY + 2, x: selectedX + 1 },
        ]
          // .filter((c) => !isOutOfBounds(c.y, c.x))
          .filter(
            ({ y, x }) => !getPiece({ board, y, x, color: selectedPieceColor })
          );

        availableSquaresMoves.push(...possibleMoves);
        break;
      }
      case "b": {
        let stopUpRight = false;
        let stopUpLeft = false;
        let stopDownRight = false;
        let stopDownLeft = false;

        for (let i = 1; i < 8; i++) {
          if (!stopUpRight)
            stopUpRight = doCoordinateCheck(selectedY - i, selectedX + i);
          if (!stopUpLeft)
            stopUpLeft = doCoordinateCheck(selectedY - i, selectedX - i);
          if (!stopDownRight)
            stopDownRight = doCoordinateCheck(selectedY + i, selectedX + i);
          if (!stopDownLeft)
            stopDownLeft = doCoordinateCheck(selectedY + i, selectedX - i);
        }
        break;
      }
      case "q": {
        let stopUp = false;
        let stopDown = false;
        let stopRight = false;
        let stopLeft = false;
        let stopUpRight = false;
        let stopUpLeft = false;
        let stopDownRight = false;
        let stopDownLeft = false;

        for (let i = 1; i < 8; i++) {
          if (!stopUp) stopUp = doCoordinateCheck(selectedY - i, selectedX);
          if (!stopDown) stopDown = doCoordinateCheck(selectedY + i, selectedX);
          if (!stopRight)
            stopRight = doCoordinateCheck(selectedY, selectedX + i);
          if (!stopLeft) stopLeft = doCoordinateCheck(selectedY, selectedX - i);
          if (!stopUpRight)
            stopUpRight = doCoordinateCheck(selectedY - i, selectedX + i);
          if (!stopUpLeft)
            stopUpLeft = doCoordinateCheck(selectedY - i, selectedX - i);
          if (!stopDownRight)
            stopDownRight = doCoordinateCheck(selectedY + i, selectedX + i);
          if (!stopDownLeft)
            stopDownLeft = doCoordinateCheck(selectedY + i, selectedX - i);
        }
        break;
      }
      case "k": {
        availableSquaresMoves.push(
          ...[
            { y: selectedY - 1, x: selectedX - 1 },
            { y: selectedY - 1, x: selectedX },
            { y: selectedY - 1, x: selectedX + 1 },
            { y: selectedY, x: selectedX - 1 },
            { y: selectedY, x: selectedX + 1 },
            { y: selectedY + 1, x: selectedX - 1 },
            { y: selectedY + 1, x: selectedX },
            { y: selectedY + 1, x: selectedX + 1 },
            {
              y: selectedY,
              x: selectedX - 2,
              condition: () =>
                canCastle[turn].queen &&
                !getPiece({ board, y: selectedY, x: selectedX - 1 }) &&
                !getPiece({ board, y: selectedY, x: selectedX - 2 }) &&
                !getPiece({ board, y: selectedY, x: selectedX - 3 }) &&
                !isInCheck({
                  board,
                  kingCoord: { y: selectedY, x: selectedX - 1 },
                  kingColor: turn,
                }) &&
                !isInCheck({
                  board,
                  kingCoord: { y: selectedY, x: selectedX - 2 },
                  kingColor: turn,
                }) &&
                !isInCheck({
                  board,
                  kingCoord: { y: selectedY, x: selectedX - 3 },
                  kingColor: turn,
                }),
            },
            {
              y: selectedY,
              x: selectedX + 2,
              condition: () =>
                canCastle[turn].king &&
                !getPiece({ board, y: selectedY, x: selectedX + 1 }) &&
                !getPiece({ board, y: selectedY, x: selectedX + 2 }) &&
                !isInCheck({
                  board,
                  kingCoord: { y: selectedY, x: selectedX + 1 },
                  kingColor: turn,
                }) &&
                !isInCheck({
                  board,
                  kingCoord: { y: selectedY, x: selectedX + 2 },
                  kingColor: turn,
                }),
            },
          ]
            // .filter((c) => !isOutOfBounds(c.y, c.x))
            .filter(({ y, x, condition }) => {
              if (getPiece({ board, y, x, color: selectedPieceColor }))
                return false;
              if (condition && !condition()) return false;

              if (isInCheck({ board, kingCoord: { y, x }, kingColor: turn }))
                return false;

              return true;
            })
        );
        break;
      }
    }
  }

  const handleSelectSquare = ({ y, x }: { y: number; x: number }) => {
    if (selectedCoords) {
      if (
        (selectedCoords.x === x && selectedCoords.y === y) || //Same piece
        (!getPiece({ board, y, x }) &&
          !availableSquaresMoves.some(
            (coord) => coord.y === y && coord.x === x
          ))
      ) {
        setSelectedCoords(undefined);
        return;
      }

      if (
        availableSquaresMoves.some((coord) => coord.y === y && coord.x === x)
      ) {
        doMove({ y, x });
        setSelectedCoords(undefined);
        return;
      }

      if (getPiece({ board, y, x, color: turn })) {
        setSelectedCoords({ y, x });
        return;
      }
    } else {
      if (!getPiece({ board, y, x, color: turn })) return;
      setSelectedCoords({ y, x });
    }
  };

  const doMove = (coord: { y: number; x: number }) => {
    if (!selectedCoords) throw new Error("Unreachable");
    const piece = board[selectedCoords.y]?.[selectedCoords.x];

    const newBoard = [...board];
    newBoard[coord.y]![coord.x] =
      newBoard[selectedCoords.y]?.[selectedCoords.x]; //Move piece
    newBoard[selectedCoords.y]![selectedCoords.x] = undefined; //Remove piece from old position

    if (piece?.id.toLowerCase() === "k") {
      setCanCastle((prev) => ({
        ...prev,
        [turn]: { king: false, queen: false },
      })); //Disable castling when king moves
      if (coord.x === selectedCoords.x - 2) {
        //Queen side castle
        newBoard[coord.y]![coord.x + 1] = newBoard[coord.y]![0]; //Move rook
        newBoard[coord.y]![0] = undefined; //Remove rook from old position
      }
      if (coord.x === selectedCoords.x + 2) {
        //King side castle
        newBoard[coord.y]![coord.x - 1] = newBoard[coord.y]![7]; //Move rook
        newBoard[coord.y]![7] = undefined; //Remove rook from old position
      }
    }

    if (piece?.id.toLowerCase() === "r") {
      if (selectedCoords.x === 0 && canCastle[turn].queen)
        setCanCastle((prev) => ({
          ...prev,
          [turn]: { ...prev[turn], queen: false },
        }));
      if (selectedCoords.x === 7 && canCastle[turn].king)
        setCanCastle((prev) => ({
          ...prev,
          [turn]: { ...prev[turn], king: false },
        }));
    }

    setBoard(newBoard);
    setTurn(otherColor(turn));
  };

  return (
    <div className="flex scale-50 flex-col md:scale-100">
      {board.map((row, y) => (
        <div className="flex" key={y}>
          {row.map((piece, x) => (
            <Square
              availableMove={availableSquaresMoves.some(
                (coord) => coord.y === y && coord.x === x
              )}
              highlighted={
                selectedCoords &&
                selectedCoords.y === y &&
                selectedCoords.x === x
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
}: {
  y: number;
  x: number;
  piece: Piece | undefined;
  handleSelectPiece: (args: { y: number; x: number }) => void;
  highlighted?: boolean;
  availableMove: boolean;
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
        }
      )}
    >
      {piece && piece.svg}
    </div>
  );
}

export default function Chess() {
  const [turn, setTurn] = useState<"white" | "black">("white");

  useEffect(() => {
    document.title = `Chess - ${turn}'s turn`;
    //play audio
  }, [turn]);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col">
        <h1 className="text-5xl font-extrabold tracking-tight text-cyan-800 sm:text-[5rem]">
          Chess
        </h1>
        <Game turn={turn} setTurn={setTurn} />
      </div>
    </div>
  );
}
