"use client";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import classNames from "classnames";
import { useMyPresence, useOthers } from "liveblocks.config";
import { type Board } from "./_utils/initial-game-state";
import { PieceSVG, type Piece } from "./_utils/pieces";
import { useIsCurrentTurnKingInCheck, useKingCoords } from "./_utils/utils";
import {
  useBoard,
  useCheckmateOrStalemate,
  useResetGame,
  useSquares,
  useTurn,
  useUpdatedDocumentTitle,
} from "./chess-hooks";

const usePresenceControl = () => {
  const [presence, setMyPresence] = useMyPresence();
  const others = useOthers();

  if (others.length > 1) throw new Error("Too many players");

  if (presence.color !== null) return;
  if (others.length === 1) {
    const otherPresence = others[0]!.presence;
    if (otherPresence.color === "white") setMyPresence({ color: "black" });
    else setMyPresence({ color: "white" });
    return;
  }

  setMyPresence({ color: "white" });
};
export function Game() {
  useUpdatedDocumentTitle();
  usePresenceControl();

  return (
    <>
      <div className="flex scale-50 flex-col md:scale-100">
        <ResetGameButton />
        <PresenceParagraph />
        <Board />
      </div>
    </>
  );
}

function ResetGameButton() {
  const resetGame = useResetGame();

  return (
    <button
      onClick={() => resetGame()}
      className="m-4 h-8 w-24 rounded-full bg-red-600 text-white"
    >
      Reset
    </button>
  );
}

function PresenceParagraph() {
  const [presence] = useMyPresence();
  return <p>You are {presence.color}</p>;
}

function Board() {
  useCheckmateOrStalemate();

  const { board } = useBoard();
  const { turn } = useTurn();

  const isInCheck = useIsCurrentTurnKingInCheck();
  const kingCoords = useKingCoords(turn);
  const { availableSquaresMoves, selectedCoord, handleSelectSquare } =
    useSquares();

  return board.map((row, y) => (
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
  ));
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
