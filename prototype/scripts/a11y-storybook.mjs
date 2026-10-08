// Runs axe-core in real Chromium against every story in the built Storybook
// (storybook-static/). Unlike the jsdom unit tests this also checks colour
// contrast and target size with real layout. Uses the globally installed
// Playwright (no extra dependency): `npm root -g`/playwright.
//
//   npm run build-storybook && npm run test:a11y-storybook
//   SCREENSHOTS=dir npm run test:a11y-storybook   # also save PNGs of screen stories
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { extname, join, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const root = resolve('storybook-static');
if (!existsSync(join(root, 'index.json'))) {
  console.error('storybook-static/ not found. Run `npm run build-storybook` first.');
  process.exit(2);
}

let playwright;
try {
  playwright = require('playwright');
} catch {
  const globalRoot = execSync('npm root -g').toString().trim();
  playwright = require(join(globalRoot, 'playwright'));
}
const axeSource = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8');

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml', '.png': 'image/png' };
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = join(root, path === '/' ? 'index.html' : path);
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const index = JSON.parse(await readFile(join(root, 'index.json'), 'utf8'));
const stories = Object.values(index.entries).filter((e) => e.type === 'story');

const browser = await playwright.chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const shots = process.env.SCREENSHOTS;
if (shots) await mkdir(shots, { recursive: true });

let total = 0;
const failures = [];
for (const s of stories) {
  await page.goto(`${base}/iframe.html?id=${s.id}&viewMode=story`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#storybook-root > *', { timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);
  await page.addScriptTag({ content: axeSource });
  const result = await page.evaluate(async () => {
    // eslint-disable-next-line no-undef
    const r = await axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
    });
    return {
      violations: r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.map((n) => n.target.join(' ')).slice(0, 5) })),
      passes: r.passes.length,
      incomplete: r.incomplete.map((v) => v.id),
      incompleteNodes: r.incomplete.flatMap((v) => v.nodes.map((n) => `${v.id}: ${n.target.join(' ')} — ${n.any.map((a) => a.message).join('; ')}`)),
    };
  });
  total += result.violations.length;
  const tag = result.violations.length ? 'FAIL' : 'ok  ';
  console.log(`${tag} ${s.title} › ${s.name}  (${result.passes} rules passed${result.incomplete.length ? `, needs review: ${result.incomplete.join(', ')}` : ''})`);
  if (process.env.VERBOSE) for (const n of result.incompleteNodes) console.log(`     ? ${n}`);
  for (const v of result.violations) {
    console.log(`     - [${v.impact}] ${v.id}: ${v.help}\n       ${v.nodes.join('\n       ')}`);
    failures.push(`${s.id}: ${v.id}`);
  }
  if (shots && !s.title.startsWith('Components/')) {
    await page.screenshot({ path: join(shots, `${s.id}.png`), fullPage: true });
  }
}

await browser.close();
server.close();
console.log(`\n${stories.length} stories checked in Chromium · ${total} axe violations`);
process.exit(total ? 1 : 0);
