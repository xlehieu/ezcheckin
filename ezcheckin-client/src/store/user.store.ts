import { UserQueryParams } from "@/@types/user.type";
import { create } from "zustand";
type UserStore ={
    userListFilter:UserQueryParams,
    setUserListFilter: (
    values: Partial<UserQueryParams>
  ) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    userListFilter:{},
    setUserListFilter: (values) =>
    set((state) => ({
      userListFilter: {
        ...state.userListFilter,
        ...values,
      },
    })),
}))