import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStore = {
  access_token: string;
  refresh_token: string;

  setTokens: (access_token: string, refresh_token: string) => void;
  clearTokens: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      access_token: "",
      refresh_token: "",

      setTokens: (access, refresh) =>
        set({
          access_token: access,
          refresh_token: refresh,
        }),

      clearTokens: () =>
        set({
          access_token: "",
          refresh_token: "",
        }),
    }),
    {
      name: "auth-ezcheckin-storage", // key trong localStorage
    }
  )
);