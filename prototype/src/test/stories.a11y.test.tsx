import { describe, expect, it, onTestFinished } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import type { ComponentType } from 'react';
import { axe } from './axe';

type StoryModule = Parameters<typeof composeStories>[0];
const modules = import.meta.glob<StoryModule>('../**/*.stories.tsx', { eager: true });

const entries = Object.entries(modules).sort(([a], [b]) => a.localeCompare(b));

describe('every story renders with zero axe violations', () => {
  it('found story files', () => {
    expect(entries.length).toBeGreaterThanOrEqual(16);
  });

  for (const [file, mod] of entries) {
    const stories = composeStories(mod) as Record<string, ComponentType>;
    const title = (mod.default as { title?: string }).title ?? file;
    describe(title, () => {
      for (const [name, Story] of Object.entries(stories)) {
        it(name, async () => {
          const { unmount } = render(<Story />);
          onTestFinished(() => unmount());
          // exactly one h1 per screen / component canvas
          expect(document.querySelectorAll('h1')).toHaveLength(1);
          // exactly one main landmark
          expect(document.querySelectorAll('main')).toHaveLength(1);
          const results = await axe(document);
          expect(results).toHaveNoViolations();
        });
      }
    });
  }
});

describe('axe harness sanity check', () => {
  it('reports violations for a deliberately broken fragment', async () => {
    const { unmount } = render(
      <div>
        <img src="x.png" />
        <input type="text" />
        <button type="button" />
      </div>,
    );
    const results = await axe(document);
    unmount();
    const ids = results.violations.map((v) => v.id);
    expect(ids).toEqual(expect.arrayContaining(['image-alt', 'label', 'button-name']));
  });
});
