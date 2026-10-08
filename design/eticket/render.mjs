// Render the concept e-ticket HTML to an A4 PDF and per-page PNG previews.
// Usage: node render.mjs <in.html> <out.pdf> [previewDir]
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve('playwright', { paths: [process.cwd(), execSync('npm root -g').toString().trim()] }));
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [input, outPdf, previewDir] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(path.resolve(input)).href);
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: outPdf, format: 'A4', printBackground: true, preferCSSPageSize: true });
if (previewDir) {
  const pages = await page.$$('.page');
  for (let i = 0; i < pages.length; i++) {
    await pages[i].screenshot({ path: path.join(previewDir, `page-${i + 1}.png`) });
  }
}
const fit = await page.$$eval('.page', ps => ps.map(p => ({ scroll: p.scrollHeight, client: p.clientHeight })));
console.log('pages:', fit.length, JSON.stringify(fit));
if (fit.some(f => f.scroll > f.client + 1)) { console.error('OVERFLOW: content does not fit A4'); process.exitCode = 1; }
await browser.close();
