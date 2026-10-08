import type { Preview } from '@storybook/react';
import '../src/styles/fonts';
import '../src/styles/tokens.css';
import '../src/styles/base.css';
import '../src/styles/components.css';
import '../src/styles/screens.css';

const preview: Preview = {
  decorators: [
    // Component stories are shown inside a <main> with a visually-hidden h1 so the
    // page-level axe rules (landmarks, one h1) apply to them as well as to screens.
    (Story, ctx) =>
      ctx.title.startsWith('Components/') ? (
        <main className="story-pad">
          <h1 className="visually-hidden">{ctx.title.replace('Components/', '')} component · {ctx.name}</h1>
          <Story />
        </main>
      ) : (
        <Story />
      ),
  ],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    backgrounds: { disable: true },
    viewport: {
      viewports: {
        mobile390: {
          name: 'Mobile 390 × 844',
          styles: { width: '390px', height: '844px' },
          type: 'mobile',
        },
      },
    },
    a11y: {
      // Run the WCAG 2.0/2.1/2.2 A + AA rule sets plus best practices.
      options: {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
      },
    },
  },
};

export default preview;
