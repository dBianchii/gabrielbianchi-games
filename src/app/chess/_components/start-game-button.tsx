/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { useSession } from "~/hooks/use-user";
import { findMatch } from "./actions";

export default function StartGameButton() {
  const session = useSession({ session: null });
  const [isMatchmaking, setIsMatchaking] = useState(false);
  useQuery({
    queryKey: ["findMatch", session.user!.id!],
    queryFn: () => findMatch(session.user!.id!),
    enabled: isMatchmaking,
    refetchInterval: 5000,
  });

  return (
    <Button
      className="w-full"
      onClick={() => {
        setIsMatchaking(!isMatchmaking);
      }}
    >
      {isMatchmaking ? "Cancel" : "Find a match"}
    </Button>
  );
}
