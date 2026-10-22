import '@testing-library/jest-dom/vitest';
import { afterEach, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import { toHaveNoViolations } from 'jest-axe';
import { setProjectAnnotations } from '@storybook/react';
import preview from '../../.storybook/preview';

expect.extend(toHaveNoViolations);
setProjectAnnotations(preview);
document.documentElement.lang = 'en';
document.title = 'railfair test';

afterEach(() => {
  cleanup();
});

// jsdom has no canvas; axe-core probes it for icon-ligature detection. Silence the noise.
HTMLCanvasElement.prototype.getContext = (() => null) as unknown as HTMLCanvasElement['getContext'];
