/** Profile-aware policy for top-level fenced examples (no renderer dependencies). */
const reportFences = Object.freeze([
  'plantuml', 'puml', 'dot', 'vega', 'vega-lite', 'vegalite', 'echarts', 'infographic',
]);
export const PROFILE_FENCES = Object.freeze({
  report: reportFences,
  'portable-docs': Object.freeze([...reportFences, 'mermaid']),
  'editable-canvas': reportFences,
});
const proseFences = new Set(['', 'text', 'json', 'md', 'markdown']);
const assetOnlyFences = new Set(['canvas', 'drawio', 'excalidraw']);

/**
 * Scan the top-level fences used by this repository, including tilde/long fences and CRLF.
 * This deliberately is not a full Markdown parser: blockquotes and list-container fences are not
 * supported authoring forms for corpus figures. Nested fence examples remain literal content.
 * @param {string} text
 * @returns {{profile: string, fences: object[], problems: {line: number, message: string}[]}}
 */
export function inspectDiagramDocument(text) {
  if (typeof text !== 'string') throw new TypeError('Expected Markdown text');
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const problems = [];
  const fences = [];
  let profile = 'report';
  let profileSeen = false;
  let fenceSeen = false;
  let open = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (open) {
      const close = line.match(/^ {0,3}(`{3,}|~{3,})[ \t]*$/);
      if (close && close[1][0] === open.marker[0] && close[1].length >= open.marker.length) {
        fences.push({ language: open.language, line: open.line, body: open.body.join('\n'), endLine: i + 1 });
        open = null;
      } else {
        open.body.push(line);
      }
      continue;
    }

    if (/^ {0,3}<!--\s*diagram-profile\b/.test(line)) {
      const marker = line.match(/^ {0,3}<!--\s*diagram-profile\s*:\s*([a-z][a-z-]*)\s*-->[ \t]*$/);
      if (!marker) {
        problems.push({ line: i + 1, message: 'Malformed diagram-profile metadata' });
      } else if (profileSeen) {
        problems.push({ line: i + 1, message: 'Duplicate diagram-profile metadata' });
      } else if (fenceSeen) {
        problems.push({ line: i + 1, message: 'diagram-profile must precede the first fence' });
      } else if (!Object.hasOwn(PROFILE_FENCES, marker[1])) {
        problems.push({ line: i + 1, message: `Unknown diagram profile "${marker[1]}"` });
      } else {
        profile = marker[1];
      }
      profileSeen = true;
      continue;
    }

    const start = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (!start) continue;
    // Backticks are forbidden in a backtick fence's info string by CommonMark.
    if (start[1][0] === '`' && start[2].includes('`')) continue;
    const language = start[2].trim().split(/\s+/)[0];
    fenceSeen = true;
    open = { language, marker: start[1], line: i + 1, body: [] };
  }
  if (open) problems.push({ line: open.line, message: 'Unclosed code fence' });
  return { profile, fences, problems };
}

/** Validate the figure authoring policy, not diagram syntax, rendering or asset editability. */
export function validateDiagramFences(text) {
  const result = inspectDiagramDocument(text);
  for (const fence of result.fences) {
    const { language, line } = fence;
    let message;
    if (language === 'html') {
      message = 'HTML cards must be bare HTML, not a code fence';
    } else if (language === 'mmd') {
      message = 'Use the canonical mermaid fence; .mmd is only a source-file extension';
    } else if (assetOnlyFences.has(language)) {
      message = `No "${language}" authoring fence: keep the source asset and reference an exported image`;
    } else if (!proseFences.has(language) && !PROFILE_FENCES[result.profile].includes(language)) {
      message = `Fence "${language}" is not allowed in profile "${result.profile}"`;
    }
    if (message) result.problems.push({ line, message });
  }
  return result;
}
