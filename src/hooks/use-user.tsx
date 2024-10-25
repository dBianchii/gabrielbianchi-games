import { type Session } from "next-auth";
import { useGuestUserStore } from "~/stores/guest-user-store";

export const useSession = ({ session }: { session: Session | null }) => {
  const guestUser = useGuestUserStore((state) => state.guestUser);

  const newSesh: Session = session ?? {
    expires: "2022-01-01T00:00:00.000Z",
    user: {
      id: guestUser.id,
      name: guestUser.name,
      email: "",
      image: "",
    },
  };

  return newSesh;
};
