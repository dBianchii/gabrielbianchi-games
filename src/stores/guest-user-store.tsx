import { create } from "zustand";

interface GuestUserStore {
  guestUser: {
    id: string;
    name: string;
  };
  setGuestUser: (guestUser: { id: string; name: string }) => void;
}

const createStore = () => {
  if (typeof window === "undefined")
    throw new Error(
      "useGuestUserStore must be used client-side only. Disable SSR"
    );
  //get user from local storage

  const key = "guet-user-gb-games";
  const fromStorage = localStorage.getItem(key);
  let initialUser: GuestUserStore["guestUser"] = JSON.parse(
    fromStorage ?? "null"
  ) as GuestUserStore["guestUser"];

  if (!initialUser) {
    const id = crypto.randomUUID();
    initialUser = {
      id: id,
      name: `Guest-${id}`,
    };
    localStorage.setItem(key, JSON.stringify(initialUser));
  }

  return create<GuestUserStore>((set) => {
    return {
      guestUser: initialUser,
      setGuestUser: (guestUser) => set({ guestUser }),
    };
  });
};

export const useGuestUserStore = createStore();
