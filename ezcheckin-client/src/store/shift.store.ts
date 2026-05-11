import { ShiftQueryParams } from "@/@types/shift.type";
import { create } from "zustand";

type ShiftStore = {
  shiftListFilter: ShiftQueryParams;
  setShiftListFilter: (values: Partial<ShiftQueryParams>) => void;
};

export const useShiftStore = create<ShiftStore>((set) => ({
  shiftListFilter: {
    current: 1,
    pageSize: 10,
  },
  setShiftListFilter: (values) =>
    set((state) => ({
      shiftListFilter: {
        ...state.shiftListFilter,
        ...values,
      },
    })),
}));
