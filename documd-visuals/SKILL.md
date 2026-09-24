---
name: documd-visuals
license: CC-BY-4.0
compatibility: >
  Report figures use the docu.md host; batch exports need Node 18+ and Chrome/Chromium via
  @markdown-viewer/documd. Portable Mermaid needs a compatible host or a separate renderer.
  Editable Excalidraw assets need an external editor/exporter; installing this skill installs neither.
description: >
  Create Markdown visuals: charts, diagrams, cards, architecture and page layouts. Route by publishing
  target and editing workflow: Mermaid for code-maintained flows, Excalidraw for editable architecture
  and whiteboards, specialist engines for reports. Covers latency, incident, throughput, cycle time,
  OKR, standup, on-call, funnel, retention, revenue, budget, correlation; approval, BPMN, class, state
  machine, sequence, dependency, ER; cloud, Kubernetes, ETL, network, security, IAM, ArchiMate, org chart,
  hiring; mind map, roadmap, Gantt, migration, SWOT, memo, policy, catalogue and case study.
  Use for README diagrams, design reviews, technical documentation and report visuals.
  Not for slide decks, math notation, canvas or drawio authoring.
---

# documd visuals

Route by **goal + publishing target + editing workflow**, not by the word "diagram" alone.

## Choose the workflow first

| Profile | Choose when | Start with |
|---|---|---|
| `report` | A docu.md report or batch document export; the default when no target is specified | The goal table below and its verified examples |
| `portable-docs` | A README, code review or technical document with code-maintained relationships | [Mermaid](engines/mermaid.md) for ordinary flow, sequence, state, class and ER diagrams |
| `editable-canvas` | A design review, whiteboard or architecture whose positions need human editing | [Excalidraw](engines/excalidraw.md) source assets plus SVG/PNG previews |

Follow [workflows.md](workflows.md) for scenario overrides, fallback rules, source ownership and
acceptance checks. Honor explicit requirements when supported. A profile does **not install a renderer**. Keep ECharts/Vega for statistics,
Graphviz for dense dependency graphs, and verified PlantUML for specialized semantics or stencils.

## Iron rules

1. **Report fences** — `plantuml` / `puml`, `dot`, `vega` / `vega-lite`, `echarts`, `infographic`;
   page layouts use **bare HTML**. `portable-docs` additionally permits canonical `mermaid` fences.
   No native `excalidraw` fence is introduced: save a scene file and reference its exported image.
2. **Not recommended for authoring:** `mmd`, `canvas`, `drawio`, or invented engine fences. Use
   `mermaid` as the Markdown fence name; `.mmd` remains a valid external source-file extension.
3. **One diagram per fence.** Do not combine diagram definitions or nest engine fences.
4. **HTML is bare, never fenced.** Start from [layered-with-wings](examples/system-architecture/layered-with-wings.md)
   for a report architecture or [executive brief](examples/internal-documents/executive-brief-summary.md)
   for a card. Choose Excalidraw instead when a person must rearrange the diagram.
5. **Inline data and assets.** Charts carry their `values` / `series`; export with local or embedded
   resources. Do not send private diagrams to public converters without authorization.
6. **State the reading in prose.** Every figure answers one question. Keep critical facts in the
   surrounding text, with a descriptive caption or alt text; a picture is not the only copy.
7. **Theme by delivery contract.** Report figures use [styles/palette.md](styles/palette.md).
   Portable native Mermaid may use the host default when configuration is unavailable; exact styling
   requires a controlled renderer and a preview asset. For Mermaid/Excalidraw mappings use
   [diagram adapters](styles/diagram-adapters.md); do not mix palettes or invent token values.

## Route by goal — report profile

The existing goal guides, catalogue and verified examples describe the **report** profile. Select
[the workflow](workflows.md) first: its portable/editable overrides take precedence over a report
engine recommendation. Engine-guide recipes are not verified corpus additions.

### A — data & metrics

| Goal | Trigger keywords | Engines | Read |
|---|---|---|---|
| service-reliability | latency · SLO · error budget · availability | echarts vega infographic | [goals/service-reliability.md](goals/service-reliability.md) |
| ops-monitoring | incident load · alert volume · anomalies · support volume | echarts vega infographic | [goals/ops-monitoring.md](goals/ops-monitoring.md) |
| delivery-throughput | throughput · cycle time · capacity · backlog · WIP | echarts vega infographic | [goals/delivery-throughput.md](goals/delivery-throughput.md) |
| goal-and-status-reporting | OKR · KPI · target vs actual · dashboard · scorecard | echarts vega infographic html-css | [goals/goal-and-status-reporting.md](goals/goal-and-status-reporting.md) |
| product-metrics | conversion · funnel · retention · cohorts · experiment | echarts infographic | [goals/product-metrics.md](goals/product-metrics.md) |
| business-reporting | quarterly results · revenue · ARR · margin · forecast | infographic vega echarts | [goals/business-reporting.md](goals/business-reporting.md) |
| go-to-market | pipeline · channel · market entry · SWOT · campaigns | echarts infographic | [goals/go-to-market.md](goals/go-to-market.md) |
| cost-and-budget | cost · spend · budget · cloud bill · unit economics | echarts infographic vega | [goals/cost-and-budget.md](goals/cost-and-budget.md) |
| data-exploration | correlation · distribution · regression · outlier detection · density | vega echarts | [goals/data-exploration.md](goals/data-exploration.md) |

### B — process & systems

| Goal | Trigger keywords | Engines | Read |
|---|---|---|---|
| engineering-operations | standup · on-call · shift handover · deploy cadence | infographic vega echarts | [goals/engineering-operations.md](goals/engineering-operations.md) |
| incident-management | incident · postmortem · escalation · runbook · change request | infographic echarts html-css | [goals/incident-management.md](goals/incident-management.md) |
| process-and-workflow | approval · workflow · swimlane · SOP · BPMN | plantuml infographic | [goals/process-and-workflow.md](goals/process-and-workflow.md) |
| software-design | class · domain model · component · use case · C4 container · SysML | plantuml | [goals/software-design.md](goals/software-design.md) |
| software-behaviour | state machine · lifecycle · sequence · interaction · EIP | plantuml | [goals/software-behaviour.md](goals/software-behaviour.md) |
| dependencies-and-relations | dependency · call graph · coupling · causality · fishbone | dot vega echarts infographic | [goals/dependencies-and-relations.md](goals/dependencies-and-relations.md) |
| system-architecture | system architecture · layer stack · zones · request path · connectors | html-css | [goals/system-architecture.md](goals/system-architecture.md) |

### C — infrastructure & governance

| Goal | Trigger keywords | Engines | Read |
|---|---|---|---|
| cloud-architecture | AWS · Azure · Kubernetes · serverless · VPC | plantuml infographic | [goals/cloud-architecture.md](goals/cloud-architecture.md) |
| data-platform | ETL · lakehouse · CDC · streaming · ML pipeline · ER model | plantuml | [goals/data-platform.md](goals/data-platform.md) |
| network-topology | network · topology · DMZ · firewall · traffic | plantuml dot echarts | [goals/network-topology.md](goals/network-topology.md) |
| security-and-compliance | zero trust · IAM · encryption · trust boundary · audit | plantuml infographic html-css | [goals/security-and-compliance.md](goals/security-and-compliance.md) |
| enterprise-architecture | ArchiMate · capability map · value stream · business architecture | plantuml infographic | [goals/enterprise-architecture.md](goals/enterprise-architecture.md) |
| organization-and-roles | org chart · reporting line · workforce · responsibilities | infographic vega echarts html-css | [goals/organization-and-roles.md](goals/organization-and-roles.md) |
| people-and-hiring | hiring · headcount plan · interview loop · onboarding | infographic | [goals/people-and-hiring.md](goals/people-and-hiring.md) |

### D — knowledge & expression

| Goal | Trigger keywords | Engines | Read |
|---|---|---|---|
| knowledge-and-outline | mind map · outline · concept map · word cloud | plantuml infographic vega echarts | [goals/knowledge-and-outline.md](goals/knowledge-and-outline.md) |
| planning-and-roadmap | roadmap · milestone · timeline · Gantt · release schedule | infographic vega plantuml html-css | [goals/planning-and-roadmap.md](goals/planning-and-roadmap.md) |
| migration-and-rollout | migration · cutover · rollout waves · work breakdown | plantuml infographic | [goals/migration-and-rollout.md](goals/migration-and-rollout.md) |
| comparison-and-selection | compare · build or buy · decision record · trade-off · priority | infographic html-css | [goals/comparison-and-selection.md](goals/comparison-and-selection.md) |
| internal-documents | memo · brief · charter · policy · principles | html-css infographic | [goals/internal-documents.md](goals/internal-documents.md) |
| catalogues-and-inventories | catalogue · inventory · entitlements · support tiers | infographic | [goals/catalogues-and-inventories.md](goals/catalogues-and-inventories.md) |
| customer-and-partner-comms | customer story · case study · announcement · partner brief | html-css | [goals/customer-and-partner-comms.md](goals/customer-and-partner-comms.md) |
| theme-and-tone | print · photocopy · low vision · colour-blind · projected · long-form | infographic dot echarts plantuml | [goals/theme-and-tone.md](goals/theme-and-tone.md) |

## Engine cheat sheet

| Engine | Reach for it when | Look elsewhere when |
|---|---|---|
| [Mermaid](engines/mermaid.md) | Ordinary relationships live beside code in a compatible Markdown host | Precise manual placement, statistical analysis or unsupported target syntax |
| [Excalidraw](engines/excalidraw.md) | Architecture reviews, annotations, spatial layouts and editable handoff | Automatic regeneration must preserve human layout without a merge strategy |
| [PlantUML](engines/plantuml.md) | Verified UML/ArchiMate/BPMN conventions or brand/device stencils | Plain graph layout (`dot`); the draw-uml implementation is not stock PlantUML |
| [Graphviz](engines/dot.md) | Computed dependency, causality or hierarchy layout | A freely arranged whiteboard |
| [Vega/Vega-Lite](engines/vega.md) | Transforms, regression, density, facets and statistical views | One heavily styled chart (`echarts`) |
| [ECharts](engines/echarts.md) | Axes, series, thresholds, annotations and dashboards | Arbitrary canvas layout |
| [Infographic](engines/infographic.md) | Template-driven roadmap, checklist, comparison or knowledge board | Statistical axes or free positioning |
| [HTML/CSS](engines/html-css.md) | Fixed report cards, prose-heavy figures and page layouts | An editable diagram whose human-maintained positions matter |

## Report capability boundaries

These limits belong to the report pipeline, not to every upstream engine or publishing host.

| Want | Fallback |
|---|---|
| 3D / globe / WebGL charts (no `echarts-gl`) | 2D `echarts`; `scatter`/`graph` for shape |
| Geographic maps (no bundled data or offline GeoJSON) | Schematic `dot` or HTML/CSS regions |
| `dataset.transform` in ECharts (reported error in 6.1.0) | Derive upstream, then `dataset.source` |
| Functions in JSON chart options | Template strings or per-item label objects |
| Remote data/images on export | Inline values and local or embedded images |
| PlantUML WBS / Salt / Timing / ditaa / JSON / YAML / EBNF / nwdiag / SDL / math | Verified mind map, `dot`, HTML/CSS or a code fence; see the engine ledger |
| Interactive charts on a static export | Labels, thresholds and callouts |
| Icons in `dot` / `vega` / `echarts` | Verified PlantUML stencils |
| Free positioning in `infographic` | HTML/CSS report layout, or Excalidraw editable asset |

## Verification and conversion

Report CLI: [converting.md](converting.md).
`npx @markdown-viewer/documd in.md out.docx` or
`npx @markdown-viewer/documd file.md --assets /tmp/figs`.
Bare `documd` on npm is a different package.

For portable diagrams, render with the **actual target host or a pinned Mermaid renderer**; for canvas
assets, reopen the saved scene, move a node, check bindings and export the preview again. Parsing alone does not establish visual correctness or editability.

On failure check the profile, syntax and target version, then use a verified alternative or preview.
The report CLI's `.mmd` input listing does not guarantee every Mermaid feature or export route.

## Where everything lives

[workflows.md](workflows.md) selects the delivery mode. [catalog/scenarios.md](catalog/scenarios.md)
indexes the report corpus, followed by `goals/<domain>.md`, `engines/<engine>.md` and
`examples/<domain>/<file>.md`. Keep new report examples registered in the catalogue; do not silently
reclassify the existing verified examples as portable or editable.
