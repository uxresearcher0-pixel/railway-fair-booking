import { useEffect, useRef, type DependencyList } from 'react';

/**
 * Focus management after an action: attach `ref` to a `.focus-target` wrapper (tabIndex -1)
 * that holds the message, and call `acted()` in the action handler. When `deps` change after an
 * action, focus moves to the wrapper. Nothing moves on first render, so stories that open in a
 * given state don't steal focus.
 */
export function useActionFocus(deps: DependencyList) {
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  useEffect(() => {
    if (done.current) ref.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return {
    ref,
    acted: () => {
      done.current = true;
    },
  };
}
