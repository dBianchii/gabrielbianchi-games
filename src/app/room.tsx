"use client";

import { ClientSideSuspense } from "@liveblocks/react";
import { RoomProvider } from "liveblocks.config";
import { type ReactNode } from "react";
import {
  initialBoard,
  initialCastling,
  initialTurn,
} from "./chess/_components/_utils/initial-game-state";

export function Room({ children, id }: { children: ReactNode; id: string }) {
  return (
    <RoomProvider
      id={id}
      initialStorage={{
        board: initialBoard,
        turn: initialTurn,
        canCastle: initialCastling,
      }}
      initialPresence={{ color: null }}
    >
      <ClientSideSuspense
        fallback={
          <div className="flex flex-col items-center justify-center">
            Joining room...
          </div>
        }
      >
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
