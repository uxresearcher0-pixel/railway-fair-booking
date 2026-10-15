export const screenParams = {
  layout: 'fullscreen',
  viewport: { defaultViewport: 'mobile390' },
} as const;

/** Story parameters for the Bangla version of a screen (read by the preview decorator). */
export const bangla = { parameters: { lang: 'bn' } } as const;

/**
 * Desktop story (≥ 1024px layout) at 1440 × 900. The "desktop" tag tells
 * scripts/a11y-storybook.mjs to run axe and take the screenshot at that size too.
 * Storybook reads tags statically, so also write `tags: ['desktop']` literally on the story.
 */
export const desktop: { tags: string[]; parameters: { viewport: { defaultViewport: string } } } = {
  tags: ['desktop'],
  parameters: { viewport: { defaultViewport: 'desktop1440' } },
};

/** Desktop story in Bangla. */
export const desktopBangla: { tags: string[]; parameters: { lang: 'bn'; viewport: { defaultViewport: string } } } = {
  tags: ['desktop'],
  parameters: { lang: 'bn', viewport: { defaultViewport: 'desktop1440' } },
};
