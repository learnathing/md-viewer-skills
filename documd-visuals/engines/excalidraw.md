# Excalidraw

An editable **asset workflow**, not a new Markdown fence or bundled docu.md renderer. Choose it for
architecture reviews, zones, annotations, brainstorming and diagrams whose placement a person owns.
For fixed prose-heavy report pages keep HTML/CSS; for frequently regenerated relationships keep Mermaid.
Read [workflows](../workflows.md) before choosing the source owner.

## Delivery contract

Keep an `.excalidraw` scene as the editable source and export an SVG/PNG for the document. A screenshot
alone is not an editable deliverable. Keep binary assets with the scene and preserve the converter's
`files` map; missing image data can make a scene appear complete while its export is incomplete.

A typical handoff uses a scene and preview with the same basename in a local assets directory. The
Markdown references the preview using descriptive alt text and links the scene separately. Create and
verify both files before writing those links; do not link nonexistent placeholder assets.

The skill does not install an editor. Use the user's existing editor or a separately installed,
version-locked client integration. Saving scene JSON, embedding an editor and exporting a preview are
three different capabilities. Do not claim that adding this skill implements all three.

## Start directly or convert once

For free spatial design, start in the editor. For a code-generated initial layout, Mermaid can seed the
canvas through `@excalidraw/mermaid-to-excalidraw`. Official converter docs and main-branch source may
cover different diagram types: validate the **installed version**, not a blanket support list.
Unsupported types or failed element extraction can fall back to a single SVG image.

This browser-side integration recipe requires both packages installed and locked by the host. It
intentionally rejects **any image element** for a workflow that requires fully editable vector content;
that conservative check also rejects legitimate embedded pictures. It is not a universal quality test.

```javascript
import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";

export async function createEditableSeed(source) {
  if (typeof source !== "string" || !source.trim()) {
    throw new TypeError("A nonempty Mermaid definition is required");
  }
  if (typeof document === "undefined") {
    throw new Error("Run this converter in the browser integration");
  }
  const result = await parseMermaidToExcalidraw(source);
  if (!Array.isArray(result.elements) || result.elements.length === 0) {
    throw new Error("The converter produced no elements");
  }
  if (result.elements.some((element) => element.type === "image")) {
    throw new Error("Image fallback: individual diagram elements are not guaranteed editable");
  }
  const elements = convertToExcalidrawElements(result.elements);
  return { elements, files: result.files ?? {} };
}
```

Pass the resulting elements and files into the host editor using its installed API. Then inspect the
canvas, save it through the editor's scene export, reopen the saved file and export its preview. The
recipe is not a server-side CLI or a complete editor implementation; it does not itself save files.

## Source ownership and edits

Choose exactly one owner as documented in [workflows](../workflows.md). In text-owned mode, canvas output
is disposable; in canvas-owned mode, Mermaid is only the initial seed. Do not overwrite manually moved
nodes when regenerating a seed, promise lossless reverse conversion, or maintain two unsynchronized
masters without telling the user.

For programmatic edits prefer the official element helpers over handwritten complete element JSON.
Preserve IDs on existing elements and check connector/text bindings after changes. Do not regenerate
an entire scene merely to change one label unless the source-owner contract permits it.

## Styling and acceptance

Use the [palette contract](../styles/palette.md) and
[diagram adapters](../styles/diagram-adapters.md). Put text in readable filled containers and export
with the chosen background when appearance must survive different host themes. Use colour for a layer
or state, not arbitrary decoration.

Reopen the saved scene and move a node: bound labels and arrows should follow as intended. Check all
expected entities and relationships, not just the absence of image elements. Inspect long/non-Latin
text, font availability, overlaps, clipping, image assets and the exported SVG/PNG. Repeat after any
renderer/converter upgrade. A nonempty scene and a successful export are not proof of editability or
semantic fidelity.

Do not upload private source to an external editor/converter without authorization. An embedded editor
is a separate client-side feature, not something this skill or a plain Markdown host supplies.

## Sources and coverage

[Coverage ledger](coverage/excalidraw.md) records the unverified integration boundaries.
Primary references: [integration](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/integration),
[element helpers](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/excalidraw-element-skeleton),
[export utilities](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/utils/export),
[converter API](https://docs.excalidraw.com/docs/@excalidraw/mermaid-to-excalidraw/api) and
[converter implementation](https://github.com/excalidraw/mermaid-to-excalidraw/blob/master/src/parseMermaid.ts).
