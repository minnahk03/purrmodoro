# Development and installation

Run `npm ci`, `npm run check-types`, `node test-engine.cjs`, then `npm run build`.
The installable archive is `PluginZip.zip`; `manifest.json` is at its root.
`Purrmodoro-Plugin.zip` in this repository is the same built archive.
Do not upload GitHub's source-code ZIP or a folder containing another ZIP.

Version 0.1.0 keeps the existing plugin ID and local storage key. It requests FocusedSubtree Read access for optional writing rewards. Update the existing plugin through RemNote's developer/publishing flow; updating source on GitHub alone does not update an installed marketplace release.

This build uses RemNote's floating-widget positioning API, never parent-frame DOM access. The cat has a transparent page; a targeted host CSS rule removes floating-frame chrome where supported. Exact frame styling/positioning must still be checked in a signed-in RemNote session. The menu remains an opaque, readable card.

Writing rewards use per-note high-water counts: opening an existing note establishes a baseline. Deleting and retyping up to that baseline earns nothing extra. Tasks are plugin-local, not imported RemNote tasks. Progress is device-local; uninstalling may remove it.

Artwork: original generated pixel sprite sheet, six poses. No reference photograph is shipped. Walking uses two alternating poses. Optional accessories are small overlays. Build covers both standard and sandbox widget entries.
