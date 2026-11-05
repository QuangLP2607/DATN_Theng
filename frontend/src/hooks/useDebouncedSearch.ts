import { useDebouncedCallback } from "use-debounce";

export default function useDebouncedSearch<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay = 400,
) {
  return useDebouncedCallback(callback, delay);
}
