# Diagram workflows

Choose the editing and delivery contract before following a report goal guide. These profiles extend
the skill's routing; they do not add renderers to docu.md, GitHub or another host.

## Decide in this order

1. Respect the requested source format, target and must-have capabilities. When they conflict, explain
   the conflict and preserve the editable source plus a compatible image instead of silently changing it.
2. Keep data analysis in ECharts/Vega, dense computed graphs in Graphviz, and specialized semantics or
   stencil requirements in the verified PlantUML path. A generic request for Mermaid or a whiteboard
   does not make it a statistical charting engine.
3. Choose `portable-docs` for code-maintained relationships in README/PR/technical docs;
   `editable-canvas` for human-maintained positions and annotations; otherwise keep `report`.
4. Verify support in the actual target. A compatible filename or fence is not sufficient evidence.

## Scenario overrides

| Goal / task | Portable document | Editable review | Report |
|---|---|---|---|
| process-and-workflow: ordinary approval flow | Mermaid flowchart | Excalidraw when people rearrange steps | Existing PlantUML/Infographic examples |
| software-behaviour: API exchange or lifecycle | Mermaid sequence/state | Excalidraw only if spatial editing is required | Verified PlantUML |
| software-design: small class/domain model | Mermaid class | Excalidraw sketch, not a semantic model | Verified PlantUML |
| data-platform: simple entity relationships | Mermaid ER | Excalidraw review annotations | Verified PlantUML |
| system-architecture: overview and boundaries | Mermaid for ordinary logical relations | Excalidraw for zones, placement, notes | HTML/CSS for fixed templates |
| dependencies-and-relations: dense dependency graph | Graphviz image + source | Graphviz base plus explicit annotations | Graphviz |
| cloud/network/security: required vendor/device icons | Verified PlantUML image + source | Excalidraw only with available licensed assets | Verified PlantUML |
| data/metrics: statistical chart | ECharts/Vega image + data/source | Same chart as an explicitly non-editable insert | ECharts/Vega |
| planning: template-driven roadmap | Infographic image; Mermaid only after target verification | Excalidraw when free placement matters | Existing Infographic/Gantt path |
| prose-heavy cards and page layouts | Standard Markdown or rendered preview | Canvas only for a design review | HTML/CSS |

Do not route by visual style alone: a hand-drawn look does not require a canvas editor. Do not force a
large graph into Mermaid merely to use one format; decompose it or keep the computed graph engine.

## Source ownership

**Text-owned:** Mermaid is authoritative; previews and canvas conversions are derived. Regeneration may
replace them. Do not offer manual canvas layout preservation unless an explicit merge mechanism exists.

**Canvas-owned:** After conversion and human editing, the `.excalidraw` scene becomes authoritative.
Retain the Mermaid input as a seed, not a second synchronized master. Regenerate only with an explicit
choice to replace the human edits. There is no promised lossless reverse conversion.

## Deliverables

| Profile | Source to retain | What the document displays | Validation |
|---|---|---|---|
| `report` | Markdown and engine source | The docu.md-rendered figure | Existing theme gates and actual export |
| `portable-docs` | Mermaid fence or `.mmd` source | Native Mermaid on a verified host; otherwise an SVG/PNG | Target-version parse **and render**, labels, edges and exports |
| `editable-canvas` | `.excalidraw` scene and referenced assets | Exported SVG/PNG with caption/alt text | Reopen, move nodes, check text/bindings, re-export |

The image and source should have the same basename. A plain Markdown image remains readable without an
Excalidraw plugin. Keep local assets alongside the source and include them in the handoff; do not embed
private content in public rendering services without authorization.

## Recipes and repository examples

The four [Mermaid recipes](engines/mermaid.md) and the [canvas handoff recipe](engines/excalidraw.md)
are workflow guidance, not claimed additions to the existing rendered report corpus. Their coverage
ledgers say what still requires target-host validation. The generated report catalogue and goal guides
remain unchanged by these recipes.

For a **registered example** that deliberately uses portable syntax, place this standalone metadata
comment outside code fences, before the first figure:

```text
<!-- diagram-profile: portable-docs -->
```

Allowed values are `report`, `portable-docs`, `editable-canvas`; omitting it keeps `report`. The comment
is validation metadata, not a Markdown renderer directive. Duplicate, unknown or malformed profiles
are errors. Use canonical `mermaid`, not an `mmd` fence. `excalidraw`, `canvas`, `drawio` and fenced
`html` remain invalid example fences in every profile. Excalidraw is an asset workflow, not a fence.

New registered examples still need their catalogue entry, theme/export checks and an appropriate
renderer. Profile-aware fence validation alone does not extend the report catalogue generators,
theme-block tools or browser-render suite to a new engine; extend those before claiming a new example
as verified. This change deliberately leaves the existing corpus untouched.

## Acceptance checklist

Check content first: intended nodes, relationships, directions and labels. Then check long or non-Latin
labels, font availability, wrapping, overlaps, light/dark host pages and export width. For images inspect
the actual SVG/PNG, not only the syntax or exit code. For converted canvases verify individual node,
text and connector editability; an SVG imported as one image is a display fallback, not editable success.

Record the renderer/converter version and what was actually tested. Dependency-free policy tests do not
replace browser-based rendering. For final styling read [diagram adapters](styles/diagram-adapters.md)
and the [palette contract](styles/palette.md).
