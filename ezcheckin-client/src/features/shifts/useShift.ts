"use client";

import { useEffect, useState, useCallback } from "react";
import { getShifts } from "@/features/shifts/shift.action";
import { usePaginationData } from "@/hooks/useDataPagination";
import { useShiftStore } from "@/store/shift.store";
import { useShallow } from "zustand/react/shallow";
import { OptionsFetch } from "@/@types/common";
import { ShiftRecord } from "@/@types/shift.type";

export function useShifts(notify?: {
  success: (msg: string) => void;
  error: (msg: string) => void;
}) {
  const { shiftListFilter, setShiftListFilter } = useShiftStore(
    useShallow((state) => ({
      shiftListFilter: state.shiftListFilter,
      setShiftListFilter: state.setShiftListFilter,
    })),
  );

  const { data, setData, setLoading, loading, setTotal, total } =
    usePaginationData<ShiftRecord>();

  const fetchShifts = async (options?: OptionsFetch) => {
    try {
      setLoading(true);

      const res = await getShifts(shiftListFilter, options);

      setData(res.data);
      setTotal(res.meta.total);
    } catch (err) {
      notify?.error("Lỗi khi tải danh sách ca làm việc");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, [shiftListFilter]);

  const reload = useCallback(() => {
    return fetchShifts({ hasRevalidate: true });
  }, [fetchShifts]);

  const changePagination = useCallback(
    (page: number, pageSize: number) => {
      setShiftListFilter({
        ...shiftListFilter,
        current: page,
        pageSize,
      });
    },
    [shiftListFilter, setShiftListFilter],
  );

  return {
    data,
    loading,
    total,

    shiftListFilter,
    setShiftListFilter,

    fetchShifts,
    reload,
    changePagination,
  };
}
