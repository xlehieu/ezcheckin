import { useRef, useCallback, useState, useEffect } from "react";

export function useOnChangeDebounce<T>(
  callbackDebounce: (value: T) => void,
  initialValue: T,
  delay = 300,
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [value, setValue] = useState<T>(initialValue);

  // sync nếu initialValue thay đổi
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const debounced = useCallback(
    (nextValue: T) => {
      setValue(nextValue);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        callbackDebounce(nextValue);
      }, delay);
    },
    [callbackDebounce, delay]
  );

  // cleanup khi unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { value, debounced };
}