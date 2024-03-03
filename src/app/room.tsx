"use client";

import { LiveObject } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import { RoomProvider } from "liveblocks.config";
import { type ReactNode } from "react";
import { initialBoard } from "./Chess/_components/_utils/initialBoard";

export function Room({ children }: { children: ReactNode }) {
  return (
    <RoomProvider
      id="anotherRoom"
      initialStorage={{
        board: initialBoard,
        turn: new LiveObject({ color: "white" }),
        canCastle: new LiveObject({
          white: new LiveObject({ king: true, queen: true }),
          black: new LiveObject({ king: true, queen: true }),
        }),
      }}
      initialPresence={{ color: "white" }}
    >
      <ClientSideSuspense fallback={<div>Chess is loading...</div>}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
