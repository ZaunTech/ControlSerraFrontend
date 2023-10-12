import { useCallback, useRef } from "react";

export const useDebounce = (delay = 300, notDelayFirstTime = true) => {
  const debouncing = useRef<NodeJS.Timeout>();
  const isFirstTime = useRef(notDelayFirstTime);

  const debounce = useCallback((func: () => void) => {
    if (isFirstTime.current) {
      func();
      return;
    }

    if (debouncing.current) {
      clearTimeout(debouncing.current);
    }

    debouncing.current = setTimeout(() => {
      func();
    }, delay);
  }, []);

  return { debounce };
};
