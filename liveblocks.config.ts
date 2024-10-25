import {
  createClient,
  type LiveObject,
  type LiveList,
} from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { type Color } from "~/app/chess/_components/_utils/initial-game-state";
import { type Piece } from "~/app/chess/_components/_utils/pieces";
import { env } from "~/env";

const client = createClient({
  publicApiKey: env.NEXT_PUBLIC_LIVEBLOCKS_API_KEY,
});

// Presence represents the properties that will exist on every User in the Room
// and that will automatically be kept in sync. Accessible through the
// `user.presence` property. Must be JSON-serializable.
type Presence = {
  color: "white" | "black" | null;
};

// Optionally, Storage represents the shared document that persists in the
// Room, even after all Users leave. Fields under Storage typically are
// LiveList, LiveMap, LiveObject instances, for which updates are
// automatically persisted and synced to all connected clients.
type Storage = {
  board: LiveList<LiveList<Piece | null>>;
  turn: LiveObject<{ color: Color }>;
  canCastle: LiveObject<{
    white: LiveObject<{ king: boolean; queen: boolean }>;
    black: LiveObject<{ king: boolean; queen: boolean }>;
  }>;
};

// Optionally, UserMeta represents static/readonly metadata on each User, as
// provided by your own custom auth backend (if used). Useful for data that
// will not change during a session, like a User's name or avatar.
// type UserMeta = {
//   id?: string,  // Accessible through `user.id`
//   info?: Json,  // Accessible through `user.info`
// };

// Optionally, the type of custom events broadcasted and listened for in this
// room. Must be JSON-serializable.
// type RoomEvent = {};

export const {
  suspense: {
    useMyPresence,
    RoomProvider,
    useStorage,
    useOthers,
    useUpdateMyPresence,
    useMutation,
  },
} = createRoomContext<Presence, Storage /* UserMeta, RoomEvent */>(client);
