import { describe, expect, it, onTestFinished } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import type { ComponentType } from 'react';
import { axe } from './axe';

type StoryModule = Parameters<typeof composeStories>[0];
const modules = import.meta.glob<StoryModule>('../**/*.stories.tsx', { eager: true });

const entries = Object.entries(modules).sort(([a], [b]) => a.localeCompare(b));

const BN = /[\u0980-\u09F2\u09F4-\u09FF]/; // Bangla script, without the ৳ sign
const textNodes = () => {
  const out: Text[] = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) out.push(n as Text);
  return out;
};
const visible = (n: Text) => !n.parentElement?.closest('[aria-hidden="true"], [hidden], script, style');
function bnTextOutsideLangBn() {
  return textNodes()
    .filter((n) => BN.test(n.data) && n.parentElement?.closest('[lang]')?.getAttribute('lang') !== 'bn')
    .map((n) => n.data.trim());
}
// Codes and IDs that keep Western digits: booking refs, invite codes, screen IDs (G2a), Storybook names.
const CODE = /\b(?:[A-Z]{1,4}\d*-[0-9A-Z-]*\d[0-9A-Z-]*|[A-Z]\d+[a-z]?|K7Q-48)\b/g;
function westernDigitsInBangla() {
  return textNodes()
    .filter(visible)
    .filter((n) => n.parentElement?.closest('[lang]')?.getAttribute('lang') === 'bn')
    .map((n) => n.data.replace(CODE, ''))
    .filter((d) => /[0-9]/.test(d))
    .map((d) => d.trim());
}

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
          // Language: Bangla text is always inside lang="bn" (so screen readers switch voice)
          expect(bnTextOutsideLangBn()).toEqual([]);
          // Bangla stories: values use Bangla digits; only codes (RF-7Q2K-48, K7Q-48) keep Western digits
          const params = (Story as unknown as { parameters?: { lang?: string } }).parameters;
          if (params?.lang === 'bn') expect(westernDigitsInBangla()).toEqual([]);
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
