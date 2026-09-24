# Mermaid and Excalidraw palette adapters

The [palette contract](palette.md) remains authoritative for fixed report figures. Choose one of its
existing themes, then copy the literal values for the roles below into the target configuration.
These are role mappings, **not new generated theme blocks** or a claim of renderer verification.

## Portable native versus fixed preview

A native Mermaid diagram may use its host's defaults if the target does not allow configuration. This
is the explicit `portable-docs` exception in [SKILL.md](../SKILL.md), not a relaxation of the report
palette gates. Host defaults do not guarantee identical colours across platforms. For a fixed-looking
figure, render and publish a preview with a pinned renderer, chosen ground and verified fonts.

## Mermaid in a controlled renderer

Use a customizable `base` theme and map `themeVariables` from the selected theme's literal values.
Do not pass semantic token names as colours. Derived Mermaid defaults can introduce new colours, so
inspect the resulting SVG and set diagram-specific variables where required.

| Mermaid field | Theme role |
|---|---|
| `background` | Theme ground; configure the exported canvas background too |
| `primaryColor`, `mainBkg`, `actorBkg` | `surface-1` |
| `primaryTextColor`, `textColor`, `actorTextColor` | `ink` |
| `primaryBorderColor`, `lineColor`, `actorBorder` | `line` |
| `secondaryColor`, `tertiaryColor`, `clusterBkg` | `surface-0` or one permitted `tint-*` |
| `secondaryTextColor`, `tertiaryTextColor`, `nodeTextColor` | `ink` |
| `secondaryBorderColor`, `tertiaryBorderColor`, `clusterBorder` | `line` |
| `noteBkgColor`, `edgeLabelBackground` | `surface-0` |
| `noteTextColor` | `ink` |
| `noteBorderColor` | `line` |

The table is a starting mapping, not a complete guarantee for every diagram family or renderer release.
Keep one accent plus neutrals for ordinary diagrams. Do not use fill-only ramp colours for text or
connectors. Keep untrusted content in a strict or sandboxed rendering configuration.

## Excalidraw assets

| Scene / element setting | Theme role |
|---|---|
| Canvas `viewBackgroundColor` | Theme ground |
| Shape `backgroundColor` | `surface-1`, `surface-0` or a permitted `tint-*` |
| Shape/arrow `strokeColor` | `line`, or `line-strong` where allowed |
| Text `strokeColor` | `ink` on approved fills |

Text and shapes use the same field name for different roles; do not copy a border colour to a label.
Use a solid fill where legibility requires it. Retain the chosen ground in the exported preview;
transparent output should be tested on every target background. Do not infer dark-page readability
from a light-ground palette, and do not claim cross-platform font fidelity without rendering it.

## Acceptance

Inspect the actual figure for contrast, all labels, clipping and connector visibility. These adapters
are not part of the existing theme-by-engine browser fixture matrix yet. Record the host/version and
checks performed before labeling a new theme/engine combination as verified.

Primary reference: [Mermaid theming](https://mermaid.js.org/config/theming.html).
Engine workflows: [Mermaid](../engines/mermaid.md) and [Excalidraw](../engines/excalidraw.md).
