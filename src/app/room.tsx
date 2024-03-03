"use client";

import { ClientSideSuspense } from "@liveblocks/react";
import { RoomProvider } from "liveblocks.config";
import { type ReactNode } from "react";
import { initialBoard } from "./Chess/_components/_utils/initialBoard";

export function Room({ children }: { children: ReactNode }) {
  return (
    <RoomProvider
      id="undo"
      initialStorage={{ board: initialBoard }}
      initialPresence={{}}
    >
      <ClientSideSuspense fallback={<div>Chess is loading...</div>}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
