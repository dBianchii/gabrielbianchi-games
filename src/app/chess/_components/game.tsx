"use client";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useMyPresence, useOthers } from "liveblocks.config";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { initialBoard } from "./_utils/initial-game-state";
import { PieceIMG, type Piece } from "./_utils/pieces";
import { useIsCurrentTurnKingInCheck, useKingCoords } from "./_utils/utils";
import {
  useBoard,
  useCheckmateOrStalemate,
  useResetGame,
  useSquares,
  useTurn,
  useUpdatedDocumentTitle,
} from "./chess-hooks";

import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const StartGameButton = dynamic(() => import("./start-game-button"), {
  ssr: false,
  loading: () => (
    <Button className="w-full" disabled>
      <Loader2 className="size-4 animate-spin" />
    </Button>
  ),
});

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
    <div className="flex flex-row">
      <div className="flex scale-50 flex-col md:scale-100">
        <TopBoardOponent />
        <LiveBoard />
        <BottomBoardMe />
      </div>
      <div className="w-auto">
        <GameStats />
      </div>
    </div>
  );
}

export function UnstartedGame() {
  return (
    <div className="flex flex-row">
      <div className="flex scale-50 flex-col md:scale-100">
        <PlayerTopOrBottom />
        <InitialBoard />
        <PlayerTopOrBottom />
      </div>
      <div className="w-full px-6 py-12">
        <Card className="h-full">
          <CardHeader></CardHeader>
          <CardContent className="h-full items-center">
            <StartGameButton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function GameStats() {
  const resetGame = useResetGame();

  return (
    <div className="flex flex-col">
      <PresenceParagraph />
      <Button
        onClick={() => resetGame()}
        className="rounded-full"
        variant={"destructive"}
      >
        Reset
      </Button>
    </div>
  );
}

function TopBoardOponent() {
  return <PlayerTopOrBottom />;
}

function BottomBoardMe() {
  return <PlayerTopOrBottom />;
}

function PlayerTopOrBottom() {
  return (
    <div className="flex flex-row">
      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={"user.avatar"} alt={"user.name"} />
          <AvatarFallback className="rounded-lg">CN</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{"user.name"}</span>
          <span className="truncate text-xs">{"user.email"}</span>
        </div>
      </div>
    </div>
  );
}

function PresenceParagraph() {
  const [presence] = useMyPresence();
  return <p>You are {presence.color}</p>;
}

function InitialBoard() {
  return (
    <div className={"flex flex-col"}>
      {initialBoard.map((row, y) => (
        <div className="flex" key={y}>
          {row.map((piece, x) => (
            <Square key={x + y} y={y} x={x} piece={piece as Piece} />
          ))}
        </div>
      ))}
    </div>
  );
}

function LiveBoard() {
  useCheckmateOrStalemate();

  const { board } = useBoard();
  const { turn } = useTurn();

  const isInCheck = useIsCurrentTurnKingInCheck();
  const kingCoords = useKingCoords(turn);
  const { availableSquaresMoves, selectedCoord, handleSelectSquare } =
    useSquares();
  const [presence] = useMyPresence();
  const shouldRotate = presence.color === "black";

  return (
    <div
      className={cn("flex flex-col", {
        "rotate-180": shouldRotate,
      })}
    >
      {board.map((row, y) => (
        <div className="flex" key={y}>
          {row.map((piece, x) => (
            <Square
              onClick={() => handleSelectSquare({ y, x })}
              className={cn({
                "rotate-180": shouldRotate,
              })}
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
              piece={piece as Piece}
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
  availableMove,
  highlightRedSquare,
  className,
  onClick,
}: {
  y: number;
  x: number;
  piece: Piece | null;
  highlighted?: boolean;
  availableMove?: boolean;
  highlightRedSquare?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex h-20 w-20 items-center justify-center border-gray-400",
        className,
        {
          "bg-[#FBCC9C]": (y + x) % 2 === 0 && !highlighted,
          "bg-[#91602E]": (y + x) % 2 === 1 && !highlighted,
          "bg-yellow-500": highlighted,
          "bg-yellow-200": availableMove,
          "bg-red-500": highlightRedSquare,
        }
      )}
    >
      {piece && <PieceIMG pieceId={piece?.id} />}
    </div>
  );
}
