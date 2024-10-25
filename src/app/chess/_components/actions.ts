"use server";

import { eq, or } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { gameRooms } from "~/server/db/schema";

export const findMatch = async (userId: string) => {
  const myOngoingGameNotCompleted = await db.query.gameRooms.findFirst({
    where: (gameRooms, { eq, and, isNotNull }) =>
      and(
        eq(gameRooms.gameType, "chess"),
        eq(gameRooms.completed, false),
        or(eq(gameRooms.player2, userId), eq(gameRooms.player1, userId)),
        isNotNull(gameRooms.player1),
        isNotNull(gameRooms.player2)
      ),
    columns: {
      id: true,
      player1: true,
      player2: true,
    },
  });
  if (myOngoingGameNotCompleted)
    redirect(`/chess/game/${myOngoingGameNotCompleted.id}`);

  const someOtherRoomWaitingForPlayers = await db.query.gameRooms.findFirst({
    where: (gameRooms, { eq, and, isNull }) =>
      and(
        eq(gameRooms.gameType, "chess"),
        eq(gameRooms.completed, false),
        isNull(gameRooms.player2)
      ),
  });

  if (
    someOtherRoomWaitingForPlayers &&
    someOtherRoomWaitingForPlayers.player1 !== userId
  )
    return await joinRoom(userId, someOtherRoomWaitingForPlayers.id);

  if (
    !someOtherRoomWaitingForPlayers ||
    someOtherRoomWaitingForPlayers?.player1 !== userId
  )
    await db.insert(gameRooms).values({
      player1: userId,
      gameType: "chess",
    });

  return false;
};

const joinRoom = async (userId: string, roomId: string) => {
  await db
    .update(gameRooms)
    .set({
      player2: userId,
    })
    .where(eq(gameRooms.id, roomId));
  redirect(`/chess/game/${roomId}`);
};
