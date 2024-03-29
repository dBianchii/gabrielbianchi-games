"use client";
import { LiveList, LiveObject } from "@liveblocks/client";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import classNames from "classnames";
import {
  useMutation,
  useMyPresence,
  useOthers,
  useStorage,
} from "liveblocks.config";
import { useEffect, useState } from "react";
import {
  convertToBoard,
  initialBoard,
  type Board,
  type Color,
  type Coord,
} from "./_utils/initialBoard";
import { PieceSVG, type Piece } from "./_utils/pieces";
import {
  areThereAvailableMoves,
  getAvailableMoves,
  getKingCoords,
  getPiece,
  isKingInCheck,
  otherColor,
} from "./_utils/utils";

export function Game() {
  const turn = useStorage((storage) => storage.turn).color;
  const setTurn = useMutation(({ storage }, newTurn: Color) => {
    storage.get("turn").set("color", newTurn);
  }, []);

  const [presence, setMyPresence] = useMyPresence();
  const others = useOthers();
  if (others.length > 1) throw new Error("Too many players");
  if (others[0] && others[0].presence.color === presence.color) {
    setMyPresence({ color: otherColor(others[0].presence.color) });
  }

  const board = useStorage((storage) => storage.board);
  const setBoard = useMutation(({ storage }, newboard: Board) => {
    const oldBoard = storage.get("board");
    oldBoard.set(0, new LiveList(newboard[0]));
    oldBoard.set(1, new LiveList(newboard[1]));
    oldBoard.set(2, new LiveList(newboard[2]));
    oldBoard.set(3, new LiveList(newboard[3]));
    oldBoard.set(4, new LiveList(newboard[4]));
    oldBoard.set(5, new LiveList(newboard[5]));
    oldBoard.set(6, new LiveList(newboard[6]));
    oldBoard.set(7, new LiveList(newboard[7]));
  }, []);

  const canCastle = useStorage((storage) => storage.canCastle);
  const setCanCastle = useMutation(
    (
      { storage },
      newCanCastle: {
        white: { king: boolean; queen: boolean };
        black: { king: boolean; queen: boolean };
      }
    ) => {
      const oldCanCastle = storage.get("canCastle");
      oldCanCastle.set(
        "white",
        new LiveObject({
          king: newCanCastle.white.king,
          queen: newCanCastle.white.queen,
        })
      );
    },
    []
  );

  const [selectedCoord, setSelectedCoord] = useState<
    { x: number; y: number } | undefined
  >();

  useEffect(() => {
    document.title = `Chess - ${turn}'s turn`;
    //play audio
  }, [turn]);

  const reset = () => {
    setBoard(convertToBoard(initialBoard));
    setCanCastle({
      white: { king: true, queen: true },
      black: { king: true, queen: true },
    });
    setSelectedCoord(undefined);
    setTurn("white");
  };

  const kingCoords = getKingCoords(board as Board, turn);
  const isInCheck = isKingInCheck({
    board: board as Board,
    kingCoord: kingCoords,
    kingColor: turn,
  });

  if (
    !areThereAvailableMoves({
      board: board as Board,
      turn,
      canCastle,
      doMove,
      kingCoords,
    })
  )
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
        board: board as Board,
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
        (!getPiece({ board: board as Board, y, x }) &&
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

      const piece = getPiece({ board: board as Board, y, x, color: turn });
      if (!piece) return;

      setSelectedCoord({ y, x });
    } else {
      if (presence.color !== turn) return;
      const piece = getPiece({ board: board as Board, y, x, color: turn });
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
    const piece = board[selectedCoord.y]![selectedCoord.x]!;

    const newBoard = JSON.parse(JSON.stringify(board)) as Board;

    newBoard[coord.y]![coord.x] = newBoard[selectedCoord.y]![selectedCoord.x]!; //Move piece
    newBoard[selectedCoord.y]![selectedCoord.x] = null; //Remove piece from old position

    if (piece?.id.toLowerCase() === "k") {
      if ((canCastle[turn].queen || canCastle[turn].king) && !preview)
        setCanCastle({ ...canCastle, [turn]: { king: false, queen: false } });

      if (coord.x === selectedCoord.x - 2) {
        //Queen side castle
        newBoard[coord.y]![coord.x + 1] = newBoard[coord.y]![0]!; //Move rook
        newBoard[coord.y]![0] = null; //Remove rook from old position
      }
      if (coord.x === selectedCoord.x + 2) {
        //King side castle
        newBoard[coord.y]![coord.x - 1] = newBoard[coord.y]![7]!; //Move rook
        newBoard[coord.y]![7] = null; //Remove rook from old position
      }
    }

    if (piece?.id.toLowerCase() === "r" && !preview) {
      if (selectedCoord.x === 0 && canCastle[turn].queen)
        setCanCastle({
          ...canCastle,
          [turn]: { ...canCastle[turn], queen: false },
        });

      if (selectedCoord.x === 7 && canCastle[turn].king)
        setCanCastle({
          ...canCastle,
          [turn]: { ...canCastle[turn], king: false },
        });
    }

    if (preview) return newBoard;
    setBoard(newBoard);

    setTurn(otherColor(turn));
    return newBoard;
  }

  return (
    <>
      <div className="flex scale-50 flex-col md:scale-100">
        <button
          onClick={() => reset()}
          className="m-4 h-8 w-24 rounded-full bg-red-600 text-white"
        >
          Reset
        </button>
        <p>You are {presence.color}</p>
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
                  selectedCoord &&
                  selectedCoord.y === y &&
                  selectedCoord.x === x
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
    </>
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
  piece: Piece | null;
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
