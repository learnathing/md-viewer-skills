# docu.md skills

Agent skills for the [docu.md](https://docu.md) Markdown pipeline. One skill package, organised by **what
the reader wants**, with the rendering engines behind it as implementation references.

**Inherited report corpus: 242 verified examples · 183 scenarios · 31 goal domains · 6 engines**, every figure coloured from one of
**nine themes** defined in `styles/` and generated from a source table, gated by `scripts/check-all.mjs`
(theme drift · contrast · block render · block coverage · theme usage · structure) plus
`scripts/verify-examples.mjs` for the full render pass.

Skills follow the [Agent Skills](https://agentskills.io/) format.

## Fork: choose a workflow before an engine

This fork adapts [markdown-viewer/skills](https://github.com/markdown-viewer/skills) with scenario-aware
routing. The existing report corpus is preserved; the new recipes are **not** counted as verified
browser-rendered examples.

| Profile | Purpose | Default route |
|---|---|---|
| `report` | docu.md reports and batch publishing | The existing specialist engines below |
| `portable-docs` | README/PR/technical diagrams maintained with code | Mermaid on a verified host, otherwise source + image |
| `editable-canvas` | Architecture reviews, human placement and annotations | Excalidraw scene + SVG/PNG preview |

Start at [workflows.md](documd-visuals/workflows.md), then read the
[Mermaid](documd-visuals/engines/mermaid.md) or [Excalidraw](documd-visuals/engines/excalidraw.md) guide.
Statistical charts stay with ECharts/Vega, dense computed graphs with Graphviz, and specialized
semantics/stencils with the verified PlantUML implementation. Excalidraw is an asset workflow, **not a
new fence**. No renderer or editor is installed by this skill; no lossless two-way conversion is promised.

Dependency-free checks: `node scripts/test-diagram-policy.mjs` tests profile/fence policy and the
canvas recipe's guards with stub dependencies. It does not render figures or validate a host editor.
The same gate is included in `scripts/check-all.mjs`; existing browser gates still need their original
external rendering environment.

---

## 🧭 Quick Navigation

**[🚀 Installation](#-installation)** • **[🧩 The Package](#-the-package)** • **[⚙️ Engines](#-engines)** • **[�️ The `documd` CLI](#-the-documd-cli)** • **[�🔀 Migrated Skills](#-migrated-skills)** • **[🔗 Links](#-links)**

---

## 🚀 Installation

### Quick Install (Recommended)

```bash
npx skills add learnathing/md-viewer-skills
```

This method works with multiple AI coding agents (Claude Code, Codex, Cursor, etc.) and discovers the
`documd-visuals` package.

### Manual Installation

**For Claude Code (Manual)**
```bash
cp -r skills/documd-visuals ~/.claude/skills/
```

**For claude.ai**

Add the package to project knowledge or paste `SKILL.md` contents into the conversation.

**For GitHub Copilot / VS Code**

Packages are automatically detected when placed in `.github/skills/` directory.

---

## 🧩 The Package

```
skills/
├── documd-visuals/        ← the skill package — the only skill here, and the only thing installed
│   ├── SKILL.md           ← router: iron rules, 31 goals, capability boundaries
│   ├── workflows.md       ← portable/editable overrides, ownership and acceptance checks
│   ├── converting.md      ← the documd CLI: install, formats, flags, what survives an export
│   ├── catalog/           ← every scenario: domain, engines, tier, example files
│   ├── goals/             ← one guide per goal domain
│   ├── engines/           ← per-engine reference + coverage/ ledgers (units, then examples by goal)
│   ├── examples/          ← 242 verified examples, grouped by goal domain
│   └── styles/            ← palette.md (the contract) + themes/<theme>.md (values + a block per engine)
├── research/              ← engine dossiers: coverage ledgers + verification notes (repo-only, never shipped)
└── scripts/               ← repo-level gates (not shipped)
```

The package is self-contained: it never cites `research/` or `scripts/`, and the gate fails the build if
it does. If you install the package, everything it references is inside it — and every file inside it is
reachable from `SKILL.md`, which `validate-skills.mjs` enforces. The one exception is `LICENSE.md`: a legal
attachment is not routing content, so it ships with the package without being linked from the router.

`research/` and `scripts/` are **not discovered as skills**: the CLI finds a skill by locating a
`SKILL.md`, and neither directory contains one. Verified — `npx skills add ./skills --list` reports
exactly one skill, `documd-visuals`.

### How a request is routed

1. `SKILL.md` selects the workflow above, then matches the reader's intent to one of **31 goal domains**, grouped into four meta-clusters:
   data & metrics · process & systems · infrastructure & governance · knowledge & expression.
2. For `report`, `goals/<domain>.md` lists scenarios and verified examples; portable/editable overrides
   live in `workflows.md` and take precedence over report-specific engine choices.
3. `engines/<engine>.md` covers the chosen engine's limits and anti-patterns.

### Goal domains

| Meta cluster | Domains |
|---|---|
| A — data & metrics | service-reliability · ops-monitoring · delivery-throughput · goal-and-status-reporting · product-metrics · business-reporting · go-to-market · cost-and-budget · data-exploration |
| B — process & systems | engineering-operations · incident-management · process-and-workflow · software-design · software-behaviour · dependencies-and-relations · system-architecture |
| C — infrastructure & governance | cloud-architecture · data-platform · network-topology · security-and-compliance · enterprise-architecture · organization-and-roles · people-and-hiring |
| D — knowledge & expression | knowledge-and-outline · planning-and-roadmap · migration-and-rollout · comparison-and-selection · internal-documents · catalogues-and-inventories · customer-and-partner-comms |

## ⚙️ Engines

**Report profile — preserved specialist engines**

| Fence | Engine | Use it for |
|---|---|---|
| `plantuml` / `puml` | draw-uml 1.5.2 → drawio2svg | UML, ArchiMate, BPMN, process, cloud/network/security architecture, 9,514 stencil icons |
| `dot` | @viz-js/viz 3.30.0 (Graphviz) | dependency, causality and hierarchy graphs with computed layout |
| `vega` / `vega-lite` | vega 6.4.0 / vega-lite 6.4.3 | charts that need data transforms, faceting, statistics |
| `echarts` | echarts 6.1.0 | report-grade charts, dashboards, gauges, annotations |
| `infographic` | @antv/infographic 0.2.20 | template-driven infographics: roadmaps, sequences, comparisons |
| (bare HTML) | built in | system architecture diagrams, cards, memos and page-level layouts |

**Portable documents:** canonical `mermaid` fences are supported by the skill when the target renders
them. **Editable diagrams:** keep `.excalidraw` source assets and display exported previews. `canvas`,
`drawio`, `mmd` and `excalidraw` authoring fences remain disallowed; `.mmd` is a source-file extension,
not the canonical Markdown fence. The internal drawio stage of PlantUML is unchanged.

## 🛠️ The `documd` CLI

This package draws figures. The **`documd` CLI** is the other half of the pipeline: it renders a whole
Markdown document to a finished file, and a diagram source to an image. It is documented inside the
package — `documd-visuals/converting.md`, linked from `SKILL.md` — so an agent that installs the skill
knows the export path exists.

**Installing the skill does not install the CLI, and the installer cannot be made to.** `npx skills add`
copies or symlinks files into an agent's skills directory; the Agent Skills format has no install-hook
field, and the CLI runs no scripts of its own during `add`. There is no point at which a skill package
could trigger `npm install`. Treat the CLI as a separate tool that the skill points at.

Nothing has to be installed to use it:

```bash
npx @markdown-viewer/documd report.md report.docx                 # also .pdf .epub .html
npx @markdown-viewer/documd architecture.puml architecture.svg    # also .png .drawio
```

Install it once if the same command runs repeatedly — this provides the `documd` binary:

```bash
npm install -g @markdown-viewer/documd
```

> ⚠️ **Use the scope.** The bare name `documd` on npm is an unrelated package ("markdown object
> notation"). `npx documd` fetches that one, not this CLI. Always write `@markdown-viewer/documd`.

The npm release carries the same version as the extension, so a `npx` run is the build documented here.

## 🔀 Migrated Skills

This repository used to ship 14 engine- and domain-named skills. They are now one package, and their content
was **rewritten, not copied**:

| Old skill | New home |
|---|---|
| `uml` | `engines/plantuml.md`, `engines/plantuml-stencils/`, `examples/software-design/`, `examples/software-behaviour/` |
| `cloud` · `network` · `security` · `iot` · `data-analytics` | `examples/cloud-architecture/`, `network-topology/`, `security-and-compliance/`, `data-platform/` |
| `archimate` · `bpmn` · `mindmap` | `examples/enterprise-architecture/`, `process-and-workflow/`, `knowledge-and-outline/` |
| `vega` · `graphviz` · `infographic` | `engines/vega.md`, `engines/dot.md`, `engines/infographic.md` |
| `architecture` · `infocard` | `engines/html-css.md` (rules, the seven architecture shapes, page skeletons, connectors); the layout set was recovered into `examples/system-architecture/`, and the card prototypes became `examples/internal-documents/`, `catalogues-and-inventories/`, `customer-and-partner-comms/`; the rest of the 90-file design library was triaged out |
| `canvas` (removed) | dropped, not migrated — a spatial whiteboard format has no target engine |

There are no compatibility stubs: the CLI discovers a skill by locating a `SKILL.md`, so a stub directory
would be ignored rather than installed — and would only add a dead directory to the repository. Reinstall
to get the new package.

---

## 📖 Package Development

### Gates

```bash
node scripts/check-all.mjs                                           # policy + existing theme gates
node scripts/test-diagram-policy.mjs                                 # dependency-free policy/recipe contracts
node scripts/validate-skills.mjs                                     # layout, budgets, catalog, fences, language, theme reachability
node scripts/build-themes.mjs --check                                 # theme files match the source tables
node scripts/build-catalog.mjs --check                               # catalog ↔ filesystem consistency
node scripts/build-goals.mjs --check                                  # goal docs match the catalog
node scripts/sync-engine-indexes.mjs --check                          # shipped template index matches the installed engine
node scripts/build-coverage.mjs --check                               # coverage ledgers match the catalog
node scripts/verify-examples.mjs --dir documd-visuals/examples --all  # render every example
```

`check-all.mjs` runs the profile/recipe tests and the theme gates — drift (`build-themes.mjs --check`), contrast
(`check-palette-contrast.mjs`, per theme), block render (`verify-blocks.mjs`), block coverage
(`apply-block.mjs --all --check`), off-theme literals (`check-palette-usage.mjs --strict`) — and
`validate-skills.mjs`, which also enforces that `styles/palette.md` and every `styles/themes/*.md`
stay reachable from `SKILL.md`, the goal docs and the engine references; add `--with-examples` for
the full render pass. All must exit 0.
`build-themes.mjs` regenerates `documd-visuals/styles/themes/*.md` from `scripts/themes.json` —
**edit the JSON, not the generated theme files**.
`build-catalog.mjs` and `build-goals.mjs` regenerate
`documd-visuals/catalog/scenarios.{json,md}` and `documd-visuals/goals/*.md` from
`documd-visuals/catalog/scenarios.tsv` — **edit the TSV, not the generated files**.

### Budgets

| File | Budget |
|---|---|
| `documd-visuals/SKILL.md` | 300 lines / 12 KB body (frontmatter description: 1024 characters — the Agent Skills limit) |
| `goals/*.md` | 200 lines |
| `engines/*.md` | 300 lines (generated `plantuml-stencils/` exempt) |
| `examples/**/*.md` | 120 lines target, 200 hard limit (verbose Vega specs) |
| `engines/coverage/*.md` | 330 lines (generated: curated unit tables + every example grouped by goal) |

### Adding an example

1. Write `documd-visuals/examples/<domain>/<scenario>.md` in the standard shape:
   *Best for / Avoid when / Answers* → the fenced block → *Data Shape / Key Options / Pitfalls /
   Alternatives* → a `<!-- source: … -->` line.
2. Add a row to `catalog/scenarios.tsv`: `domain <TAB> scenario <TAB> engine <TAB> file`.
3. `node scripts/build-catalog.mjs --apply && node scripts/build-goals.mjs`.
4. `node scripts/verify-examples.mjs --dir documd-visuals/examples --all`.

Portable example metadata and the distinction between authoring recipes and registered rendered
examples are documented in [workflows.md](documd-visuals/workflows.md). This change adds no new entries
to the report catalogue and does not extend its generators or theme/render matrix to new engines.
A future registered Mermaid example still needs those integrations; passing fence policy alone is not
a rendered-example verification.

### Code fence reference

| Engine | Fence | Output |
|---|---|---|
| PlantUML (draw-uml) | ` ```plantuml ` / ` ```puml ` | SVG |
| Graphviz | ` ```dot ` | SVG |
| Vega-Lite / Vega | ` ```vega-lite ` / ` ```vega ` | PNG |
| ECharts | ` ```echarts ` | PNG |
| Infographic | ` ```infographic ` | PNG |
| HTML/CSS | (no fence, raw HTML) | HTML |
| Mermaid (`portable-docs`) | ` ```mermaid ` | Host render or external SVG/PNG preview |
| Excalidraw (`editable-canvas`) | source asset, not a fence | Editable scene + exported SVG/PNG |
| Canvas · drawio · mmd · excalidraw fences | not authoring targets | — |

---

## 🔗 Links

- [Markdown Viewer Extension](https://docu.md) - The rendering engine behind these skills
- [Agent Skills Format](https://agentskills.io/) - Standard format for AI agent skills
- [Chrome Extension](https://chromewebstore.google.com/detail/markdown-viewer/jekhhoflgcfoikceikgeenibinpojaoi) - Install for Chrome and Chromium browsers
- [Edge Extension](https://microsoftedge.microsoft.com/addons/detail/documd-markdown-viewer/iphmkjlbnogmhofmmcahdhodiilokfca) - Install from Microsoft Edge Add-ons
- [Firefox Add-on](https://addons.mozilla.org/firefox/addon/markdown-viewer-extension/) - Install for Firefox
- [Obsidian Plugin](https://community.obsidian.md/plugins/markdown-viewer-extension) - Install from the Obsidian community directory
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=xicilion.markdown-viewer-extension) - Install for VS Code

---

## 🤝 Contributing

Contribute to the single package, not to new engine-named skills:

1. Find the goal domain your example belongs to in `documd-visuals/catalog/scenarios.tsv` (or open
   `SKILL.md` to see the router). If no domain fits, propose one — domains hold 3–8 scenarios.
2. Write the example and register it in the TSV (see *Adding an example* above).
3. Run all four gates; a failing render or a stale catalog blocks the change.
4. Keep statements traceable: every example ends with `<!-- source: … -->` pointing at the engine docs.

---

## 📄 License

**The skill package (`documd-visuals/`) is [CC-BY-4.0](LICENSE)** — use it, copy it, adapt it and
redistribute it, including commercially and including the examples, with attribution. The same text ships
inside the package as [`documd-visuals/LICENSE.md`](documd-visuals/LICENSE.md), so an installed copy
carries its own terms. The grant covers the whole repository, including the repo-only tooling in
`scripts/` and the dossiers in `research/` — neither directory is shipped or discovered as a skill.

**The `documd` CLI and the rendering engines are separate works under GPL-3.0-only.**
`@markdown-viewer/documd`, `@markdown-viewer/draw-uml` and `@markdown-viewer/drawio2svg` are not part of
this package and are not covered by the CC-BY-4.0 grant above; installing the skill does not license them.

**Attribution, in practice.** CC-BY-4.0 asks for it when you share the package, and only then. Vendor it and
keep `LICENSE.md` beside it, or put one credit line in your project's notices — both satisfy it. Writing
documents *with* the skill, and documents that stay inside your organisation, require nothing at all. Never a
per-figure credit. Full detail: [`documd-visuals/LICENSE.md`](documd-visuals/LICENSE.md).

**Third-party names** used throughout this package — PlantUML, AWS, Azure, Cisco, ArchiMate, ECharts,
Vega, AntV and others — are the trademarks of their respective owners, referenced only to describe the
syntax and icon sets this package documents. No trademark rights are granted.
