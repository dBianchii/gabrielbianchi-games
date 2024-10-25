import { notFound } from "next/navigation";
import { Room } from "~/app/room";
import { db } from "~/server/db";
import { Game } from "../../_components/game";

export default async function Chess({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const game = await db.query.gameRooms.findFirst({
    where: (gameRooms, { eq }) => eq(gameRooms.id, id),
  });
  if (!game) notFound();

  return (
    <div className="flex justify-center">
      <div className="flex flex-col">
        <Room id={id}>
          <Game />
        </Room>
      </div>
    </div>
  );
}
