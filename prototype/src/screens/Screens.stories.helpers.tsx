export const screenParams = {
  layout: 'fullscreen',
  viewport: { defaultViewport: 'mobile390' },
} as const;

/** Story parameters for the Bangla version of a screen (read by the preview decorator). */
export const bangla = { parameters: { lang: 'bn' } } as const;
