# Mermaid coverage ledger

Scope: portable authoring guidance and profile-policy tests. This ledger does **not** claim a bundled
Mermaid version, browser render pass or new verified report examples.

| Unit | Disposition | Evidence / required check |
|---|---|---|
| Flowchart, sequence, state, ER | Included as recipes | Primary Mermaid documentation; render on the actual target |
| Small class model | Recommended where supported | Check installed/host syntax and relationship labels |
| Canonical `mermaid` fence | Allowed in portable-docs examples | Dependency-free profile-policy tests |
| Mermaid in default report examples | Rejected unless explicitly portable | Backward-compatible profile-policy tests |
| `.mmd` source extension | External renderer input | Not an `mmd` Markdown fence alias |
| Native GitHub display | Host capability, not supplied here | GitHub docs; verify host version |
| Exact theme/export consistency | Conditional | Pinned renderer plus preview inspection |
| Optional layouts, icons, beta syntax, HTML labels | Not portable defaults | Explicit host support and fixture required |
| Dense graphs / statistical plots | Delegate | Graphviz / ECharts / Vega |
| Automatic reverse conversion from canvas | Not promised | Single source-owner contract |

Recipes and sources: [Mermaid](../mermaid.md). Profile rules: [workflows](../../workflows.md).
Palette mappings: [diagram adapters](../../styles/diagram-adapters.md).
