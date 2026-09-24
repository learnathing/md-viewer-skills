#!/usr/bin/env node
/** Policy and recipe-contract tests only; these do not render Mermaid or Excalidraw. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { inspectDiagramDocument, PROFILE_FENCES, validateDiagramFences } from './lib/diagram-policy.mjs';

const root = path.resolve(import.meta.dirname, '..');
const read = (name) => fs.readFileSync(path.join(root, 'documd-visuals', name), 'utf8');
const marker = (profile) => `<!-- diagram-profile: ${profile} -->\n`;
const block = (language, body = 'A --> B') => `\`\`\`${language}\n${body}\n\`\`\`\n`;
const valid = (text) => assert.deepEqual(validateDiagramFences(text).problems, []);
const invalid = (text, match) => assert.ok(
  validateDiagramFences(text).problems.some((problem) => match.test(problem.message)),
  `Expected a problem matching ${match}`,
);

for (const language of PROFILE_FENCES.report) {
  test(`unmarked report examples retain ${language}`, () => valid(block(language)));
}
test('unmarked examples default to report', () => {
  assert.equal(validateDiagramFences(block('dot')).profile, 'report');
});
test('Mermaid needs an explicit portable profile', () => invalid(block('mermaid'), /profile "report"/));
test('portable examples admit canonical Mermaid', () => valid(marker('portable-docs') + block('mermaid')));
test('portable mode retains specialist figure sources', () => valid(marker('portable-docs') + block('vega')));
test('explicit report mode does not enable Mermaid', () => invalid(marker('report') + block('mermaid'), /report/));
test('editable mode does not invent native Mermaid support', () => invalid(marker('editable-canvas') + block('mermaid'), /editable-canvas/));
for (const profile of Object.keys(PROFILE_FENCES)) {
  for (const language of ['canvas', 'drawio', 'excalidraw', 'mmd', 'html']) {
    test(`${profile} rejects the ${language} fence`, () => invalid(marker(profile) + block(language), /./));
  }
}
test('prose fences are not diagram formats', () => {
  for (const language of ['', 'text', 'json', 'md', 'markdown']) valid(block(language));
});
test('unknown languages fail closed', () => invalid(block('made-up-engine'), /not allowed/));
test('noncanonical capitalization is not silently accepted', () => invalid(marker('portable-docs') + block('Mermaid'), /not allowed/));
test('unknown profile fails closed', () => invalid(marker('portable') + block('mermaid'), /Unknown/));
test('prototype keys are not profiles', () => invalid(marker('constructor') + block('dot'), /Unknown/));
test('duplicate profiles are rejected even when identical', () => invalid(marker('report') + marker('report'), /Duplicate/));
test('conflicting profiles are rejected', () => invalid(marker('report') + marker('portable-docs'), /Duplicate/));
test('malformed metadata is not silently ignored', () => invalid('<!-- diagram-profile portable-docs -->', /Malformed/));
test('metadata must precede the first fence', () => invalid(block('text') + marker('portable-docs'), /precede/));
test('metadata inside a fence cannot change the profile', () => {
  const result = validateDiagramFences(block('text', marker('portable-docs')) + block('mermaid'));
  assert.equal(result.profile, 'report');
  assert.ok(result.problems.some((p) => /report/.test(p.message)));
});
test('quoted metadata cannot change the top-level profile', () => {
  assert.equal(inspectDiagramDocument('> ' + marker('portable-docs')).profile, 'report');
});
test('tilde fences cannot bypass the policy', () => invalid('~~~mermaid\nA --> B\n~~~', /report/));
test('long fences cannot bypass the policy', () => invalid('````mermaid\nA --> B\n````', /report/));
test('indented top-level fences cannot bypass the policy', () => invalid('   ```mermaid\nA --> B\n   ```', /report/));
test('long and tilde fences work with the portable profile', () => {
  valid(marker('portable-docs') + '~~~~mermaid\nflowchart LR\nA --> B\n~~~~~');
});
test('a shorter embedded fence is literal content', () => {
  const doc = '````markdown\n```mermaid\nA --> B\n```\n````';
  valid(doc);
  assert.equal(inspectDiagramDocument(doc).fences.length, 1);
});
test('a different marker cannot close a fence', () => invalid('```dot\nA -> B\n~~~', /Unclosed/));
test('unclosed fences report their opening line', () => {
  const result = validateDiagramFences('# Example\n\n```dot\nA -> B');
  assert.deepEqual(result.problems, [{ line: 3, message: 'Unclosed code fence' }]);
});
test('CRLF and trailing metadata whitespace are supported', () => {
  valid('<!-- diagram-profile: portable-docs -->  \r\n```mermaid\r\nA --> B\r\n```\r\n');
});
test('source line numbers are retained', () => {
  assert.equal(validateDiagramFences('# Title\n\n' + block('mermaid')).problems[0].line, 3);
});
test('calls do not leak a previous profile', () => {
  valid(marker('portable-docs') + block('mermaid'));
  invalid(block('mermaid'), /report/);
});
test('non-string input gives a clear error', () => assert.throws(() => validateDiagramFences(null), TypeError));

test('SKILL keeps budgets, goal anchors, profiles and theme links', () => {
  const text = read('SKILL.md');
  const body = text.replace(/^---[\s\S]*?^---/m, '');
  const description = text.match(/^description:\s*>?([\s\S]*?)^---/m)[1].trim().replace(/\n\s*/g, ' ');
  assert.ok(Buffer.byteLength(body) <= 12 * 1024, `Body is ${Buffer.byteLength(body)} bytes`);
  assert.ok(description.length <= 1024, `Description is ${description.length} characters`);
  assert.ok(text.split('\n').length <= 300);
  assert.equal((text.match(/\[goals\//g) ?? []).length, 31);
  for (const profile of Object.keys(PROFILE_FENCES)) assert.ok(text.includes(profile));
  for (const keyword of ['latency', 'incident', 'throughput', 'cycle time', 'OKR', 'funnel', 'retention',
    'revenue', 'budget', 'correlation', 'standup', 'on-call', 'approval', 'BPMN', 'class', 'state machine',
    'sequence', 'dependency', 'ER', 'architecture', 'cloud', 'Kubernetes', 'ETL', 'network', 'security',
    'IAM', 'ArchiMate', 'org chart', 'hiring', 'mind map', 'roadmap', 'Gantt', 'migration', 'SWOT', 'memo',
    'policy', 'catalogue', 'case study', 'layout']) assert.ok(description.includes(keyword), keyword);
  assert.ok(text.includes('(styles/palette.md)'));
});
test('new guides retain coverage and palette links', () => {
  for (const engine of ['mermaid', 'excalidraw']) {
    const text = read(`engines/${engine}.md`);
    assert.ok(text.includes(`(coverage/${engine}.md)`));
    assert.ok(text.includes('(../styles/palette.md)'));
    assert.ok(read(`engines/coverage/${engine}.md`).includes('ledger'));
    assert.ok(text.split('\n').length <= 300);
  }
});
test('all four Mermaid recipes satisfy the portable fence policy', () => {
  const result = inspectDiagramDocument(read('engines/mermaid.md'));
  assert.deepEqual(result.problems, []);
  const diagrams = result.fences.filter((fence) => fence.language === 'mermaid');
  assert.equal(diagrams.length, 4);
  assert.deepEqual(diagrams.map((f) => f.body.split('\n')[0].split(' ')[0]),
    ['flowchart', 'sequenceDiagram', 'stateDiagram-v2', 'erDiagram']);
  for (const figure of diagrams) valid(marker('portable-docs') + block('mermaid', figure.body));
});

// Execute only the authored JavaScript recipe with stub dependencies. This tests guards and data
// handoff, not the external converter, the browser editor or the visual correctness of a scene.
function recipe(parse, convert = (elements) => elements, browser = {}) {
  const snippet = inspectDiagramDocument(read('engines/excalidraw.md')).fences
    .find((fence) => fence.language === 'javascript').body;
  const code = snippet.replace(/^import .*;\n/gm, '').replace('export async function', 'async function');
  return new Function('parseMermaidToExcalidraw', 'convertToExcalidrawElements', 'document',
    `${code}\nreturn createEditableSeed;`)(parse, convert, browser);
}
test('canvas recipe rejects blank or non-string source', async () => {
  const fn = recipe(() => { throw new Error('must not run'); });
  await assert.rejects(fn(' '), TypeError);
  await assert.rejects(fn(null), TypeError);
});
test('canvas recipe requires a browser integration', async () => {
  const snippet = inspectDiagramDocument(read('engines/excalidraw.md')).fences.find((f) => f.language === 'javascript').body;
  const code = snippet.replace(/^import .*;\n/gm, '').replace('export async function', 'async function');
  const noBrowser = new Function('parseMermaidToExcalidraw', 'convertToExcalidrawElements', 'document',
    `${code}\nreturn createEditableSeed;`)(() => { throw new Error('must not run'); }, (x) => x, undefined);
  await assert.rejects(noBrowser('flowchart LR'), /browser/);
});
test('canvas recipe rejects empty converter output', async () => {
  await assert.rejects(recipe(async () => ({ elements: [] }))('flowchart LR'), /no elements/);
});
test('canvas recipe rejects single-image fallback', async () => {
  await assert.rejects(recipe(async () => ({ elements: [{ type: 'image' }] }))('flowchart LR'), /Image fallback/);
});
test('canvas recipe rejects mixed image content in strict editable mode', async () => {
  await assert.rejects(recipe(async () => ({ elements: [{ type: 'rectangle' }, { type: 'image' }] }))('flowchart LR'), /Image fallback/);
});
test('canvas recipe preserves files and normalizes skeletons', async () => {
  const files = { asset: { dataURL: 'data:test' } };
  const result = await recipe(async () => ({ elements: [{ type: 'rectangle' }], files }),
    (elements) => elements.map((element) => ({ ...element, normalized: true })))('flowchart LR');
  assert.equal(result.files, files);
  assert.equal(result.elements[0].normalized, true);
});
test('canvas recipe defaults missing files to an empty map', async () => {
  const result = await recipe(async () => ({ elements: [{ type: 'rectangle' }] }))('flowchart LR');
  assert.deepEqual(result.files, {});
});
test('canvas recipe propagates converter failure', async () => {
  await assert.rejects(recipe(async () => { throw new Error('parse failed'); })('bad source'), /parse failed/);
});
