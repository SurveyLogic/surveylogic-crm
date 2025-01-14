import { useCallback, useLayoutEffect, useRef } from "react";

export function useEventCallback<Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
): (...args: Args) => Return {
  // ref is not initialized, in order to ensure that we can't call this in the render phase
  // ref.current will be undefined if we call the `fn` during render phase (as a render function)
  const ref = useRef<typeof fn | undefined>(undefined);

  useLayoutEffect(() => {
    ref.current = fn;
  });

  return useCallback((...args: Args) => {
    // make sure that the value of `this` provided for the call to fn is not `ref`
    // @ts-ignore-error
    return ref.current.apply(void 0, args);
  }, []);
}
