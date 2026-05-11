import { useState } from "react";

type usePaginationDataProps<T> = {
  initialData?: T[];
  initialTotal?: number;
  initialLoading?: boolean;
};

export function usePaginationData<T>({
  initialData = [],
  initialTotal = 0,
  initialLoading = false,
}: usePaginationDataProps<T> = {}) {
  const [data, setData] = useState<T[]>(initialData);

  const [loading, setLoading] = useState(initialLoading);

  const [total, setTotal] = useState(initialTotal);

  return {
    data,
    setData,

    loading,
    setLoading,

    total,
    setTotal,
  };
}