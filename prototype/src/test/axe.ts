import axeCore from 'axe-core';

/**
 * Runs axe-core on the whole jsdom document (so page-level rules such as
 * landmark-one-main, page-has-heading-one and html-has-lang also apply).
 * Rule sets: WCAG 2.0/2.1/2.2 A + AA and best practices.
 * color-contrast cannot be computed in jsdom (no layout/paint), so it is
 * covered by the Playwright run against the built Storybook instead.
 */
export function axe(context: axeCore.ElementContext = document) {
  return axeCore.run(context, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
    rules: { 'color-contrast': { enabled: false } },
  });
}
