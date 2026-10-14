import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/** Copy rules from the brief, enforced over all source files. */
const root = join(__dirname, '..');
const files: string[] = [];
const walk = (d: string) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|css)$/.test(f) && !p.includes(`${join('src', 'test')}`)) files.push(p);
  }
};
walk(root);
const text = files.map((f) => readFileSync(f, 'utf8')).join('\n');

describe('content rules', () => {
  it('never says identity is "verified"', () => {
    expect(text).not.toMatch(/\bverif(y|ied|ication)\b/i);
  });
  it('uses no family-relationship words', () => {
    expect(text).not.toMatch(/\b(uncle|aunt|auntie|nephew|niece|cousin|mother|father|son|daughter|brother|sister|husband|wife)\b/i);
  });
  it('is not branded as the national railway', () => {
    expect(text).not.toMatch(/Bangladesh Railway|Rail Sheba/i);
  });
  it('shows the concept-demo banner text', () => {
    expect(text).toContain('Concept demo — not a real booking service');
  });
  it('uses the professional role wording', () => {
    for (const w of ['Booked by', 'Paid by', 'Traveller', 'Accompanying adult', 'NID record matched']) expect(text).toContain(w);
  });
  // Bangla text is checked on the rendered DOM instead (stories.a11y.test.tsx):
  // every Bangla text node must sit inside an element with lang="bn".
});
