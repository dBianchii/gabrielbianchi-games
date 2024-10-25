/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LiveList } from "@liveblocks/client";
import { useMutation, useMyPresence, useStorage } from "liveblocks.config";
import { useEffect, useState } from "react";
import {
  convertToBoard,
  initialBoard,
  type Board,
  type Color,
  type Coord,
} from "./_utils/initial-game-state";
import { type Piece } from "./_utils/pieces";
import {
  getAvailableMoves,
  getPiece,
  otherColor,
  useAreThereAvailableMoves,
  useIsCurrentTurnKingInCheck,
  useKingCoords,
} from "./_utils/utils";

export const useUpdatedDocumentTitle = () => {
  const turn = useStorage((storage) => storage.turn).color;
  useEffect(() => {
    document.title = `Chess - ${turn}'s turn`;
  }, [turn]);
};

export const useCheckmateOrStalemate = () => {
  const areThereAvailableMoves = useAreThereAvailableMoves();
  const isInCheck = useIsCurrentTurnKingInCheck();

  if (!areThereAvailableMoves)
    if (isInCheck) alert("Checkmate");
    else alert("Stalemate");
};

export const useSquares = () => {
  const { board, setBoard } = useBoard();
  const { turn, setTurn } = useTurn();
  const [selectedCoord, setSelectedCoord] = useState<
    { x: number; y: number } | undefined
  >();
  const { canCastle, setCanCastle } = useCastling();
  const kingCoords = useKingCoords(turn);

  const [presence] = useMyPresence();

  function doMove({
    coord,
    preview,
    selectedCoord,
  }: {
    coord: Coord;
    preview?: boolean;
    selectedCoord: Coord;
  }) {
    const piece = board[selectedCoord.y]![selectedCoord.x]! as Piece;

    const newBoard = JSON.parse(JSON.stringify(board)) as Board;

    newBoard[coord.y]![coord.x] = newBoard[selectedCoord.y]![selectedCoord.x]!; //Move piece
    newBoard[selectedCoord.y]![selectedCoord.x] = null; //Remove piece from old position

    if (piece?.id.toLowerCase() === "k") {
      if ((canCastle[turn].queen || canCastle[turn].king) && !preview) {
        setCanCastle({ color: turn, side: "queen", boolean: false });
        setCanCastle({ color: turn, side: "king", boolean: false });
      }

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
          color: turn,
          side: "queen",
          boolean: false,
        });

      if (selectedCoord.x === 7 && canCastle[turn].king)
        setCanCastle({
          color: turn,
          side: "king",
          boolean: false,
        });
    }

    if (preview) return newBoard;
    setBoard(newBoard);

    setTurn(otherColor(turn));
    return newBoard;
  }

  const availableSquaresMoves: {
    y: number;
    x: number;
    condition?: () => boolean;
  }[] = [];
  if (selectedCoord) {
    const selectedPiece = board[selectedCoord.y]?.[selectedCoord.x] as Piece;
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

  return {
    doMove,
    selectedCoord,
    handleSelectSquare,
    availableSquaresMoves,
    setSelectedCoord,
  };
};
export const useBoard = () => {
  const board = useStorage((storage) => storage.board);
  const setBoard = useMutation(({ storage }, newboard: Board) => {
    const oldBoard = storage.get("board");
    oldBoard.set(0, new LiveList(newboard[0] as Piece[]));
    oldBoard.set(1, new LiveList(newboard[1] as Piece[]));
    oldBoard.set(2, new LiveList(newboard[2] as Piece[]));
    oldBoard.set(3, new LiveList(newboard[3] as Piece[]));
    oldBoard.set(4, new LiveList(newboard[4] as Piece[]));
    oldBoard.set(5, new LiveList(newboard[5] as Piece[]));
    oldBoard.set(6, new LiveList(newboard[6] as Piece[]));
    oldBoard.set(7, new LiveList(newboard[7] as Piece[]));
  }, []);
  const resetBoard = () => setBoard(convertToBoard(initialBoard));

  return { board, setBoard, resetBoard };
};

export const useTurn = () => {
  const {
    turn: { color: turn },
  } = useStorage((storage) => storage);

  const setTurn = useMutation(({ storage }, newTurn: Color) => {
    storage.get("turn").set("color", newTurn);
  }, []);

  return { turn, setTurn };
};

export const useCastling = () => {
  const canCastle = useStorage((storage) => storage.canCastle);
  const setCanCastle = useMutation(
    (
      { storage },
      {
        color,
        side,
        boolean,
      }: {
        color: Color;
        side: "king" | "queen";
        boolean: boolean;
      }
    ) => {
      storage.get("canCastle").get(color).set(side, boolean);
    },
    []
  );

  const resetCastling = () => {
    const colors = ["white", "black"] as const;
    const sides = ["king", "queen"] as const;
    for (const color of colors)
      for (const side of sides) setCanCastle({ color, side, boolean: false });
  };

  return { canCastle, setCanCastle, resetCastling };
};

export const useResetGame = () => {
  const { resetCastling } = useCastling();
  const { resetBoard } = useBoard();
  const { setTurn } = useTurn();
  const { setSelectedCoord } = useSquares();

  const resetGame = () => {
    resetBoard();
    resetCastling();
    setSelectedCoord(undefined);
    setTurn("white");
  };

  return resetGame;
};
