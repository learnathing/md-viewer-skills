# Excalidraw coverage ledger

Scope: editable-source delivery guidance. No Excalidraw runtime, saved scene fixture or browser render
verification is bundled by this change. An integration must verify its installed versions separately.

| Unit | Disposition | Evidence / required check |
|---|---|---|
| Scene + SVG/PNG handoff | Recommended | Reopen the scene; inspect the actual preview and local assets |
| Native `excalidraw` Markdown fence | Rejected | No renderer added; profile-policy tests |
| Browser editor | External dependency | Host integration, not skill installation |
| Mermaid-to-canvas seed | Conditional | Installed converter version and diagram-specific fixtures |
| Unsupported or failed conversion | May become a single image | Converter implementation; image fallback must not count as editable success |
| Image-free conversion recipe | Conservative guard only | Still inspect nodes, labels, relations and bindings |
| Preserving human edits | Source-owner dependent | Never overwrite canvas-owned layout automatically |
| Lossless two-way synchronization | Not promised | No reverse-conversion or merge implementation supplied |
| Themes and font rendering | Conditional | Palette mapping plus browser/export inspection |
| Private diagrams | Local/authorized processing | Do not send source to a public converter without authorization |

Workflow and primary references: [Excalidraw](../excalidraw.md). Ownership:
[workflows](../../workflows.md). Styling: [diagram adapters](../../styles/diagram-adapters.md).
