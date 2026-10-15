import type { ReactNode } from 'react';

/**
 * A code or ID that stays in Latin script in both languages (fingerprints, versions, screen codes).
 * Marked lang="en" so screen readers use the English voice and Bangla-digit rules don't apply.
 */
export function Code({ children, chip = false }: { children: ReactNode; chip?: boolean }) {
  return (
    <span lang="en" className={chip ? 'code-chip mono' : 'mono'}>
      {children}
    </span>
  );
}
