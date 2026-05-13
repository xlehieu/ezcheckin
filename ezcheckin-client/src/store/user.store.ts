import { UserQueryParams } from "@/@types/user.type";
import { create } from "zustand";

type UserStore = {
  userListFilter: UserQueryParams;
  setUserListFilter: (values: Partial<UserQueryParams>) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  userListFilter: {
    current: 1,
    pageSize: 10,
  },
  setUserListFilter: (values) =>
    set((state) => ({
      userListFilter: {
        ...state.userListFilter,
        ...values,
      },
    })),
}));
