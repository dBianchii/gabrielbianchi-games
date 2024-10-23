"use client";

import { ClientSideSuspense } from "@liveblocks/react";
import { RoomProvider } from "liveblocks.config";
import { type ReactNode } from "react";
import {
  initialBoard,
  initialCastling,
  initialTurn,
} from "./Chess/_components/_utils/initial-game-state";

export function Room({ children }: { children: ReactNode }) {
  return (
    <RoomProvider
      id="anotherRoom"
      initialStorage={{
        board: initialBoard,
        turn: initialTurn,
        canCastle: initialCastling,
      }}
      initialPresence={{ color: null }}
    >
      <ClientSideSuspense fallback={<div>Chess is loading...</div>}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
