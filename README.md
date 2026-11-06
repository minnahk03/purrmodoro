# Purrmodoro — your little study companion

A RemNote desktop/web plugin with a ginger cat at the bottom-right of your screen.

## Install
1. Open RemNote → Settings → Plugins (or Plugins and Themes) → Build.
2. Choose Upload Plugin and upload Purrmodoro-Plugin.zip (do not unzip that inner file).
3. Enable the plugin. Mochi should appear in the bottom-right corner.
4. If hidden, open RemNote's command search and run “Purrmodoro: show study cat”.

If your RemNote version does not offer ZIP installation, use the development route below. Installation in a signed-in RemNote account has not been tested in this build.

## Use
- Click the cog to set focus minutes, short and long breaks, sessions per set, your cat's name, and sound.
- One complete focus minute earns one coin. Breaks and paused time earn none.
- A treat costs 5 coins; play costs 10. The cat animates in response.
- Start each interval yourself. After the last focus session, take a long break; the next set starts at session 1.
- Minimise with “−” to keep a small cat and timer at the bottom of RemNote.
- Reset restarts the current interval and preserves earned coins. Saving settings starts a new set.
- Progress uses RemNote's local plugin storage on this device; it is not cloud synced. Keep one RemNote window active for this plugin to avoid conflicting writes.
- A running interval uses a real clock deadline. If RemNote sleeps or closes, reopening reconciles only that interval, awards at most its focus minutes, and waits for you to start the next. Pause before stepping away if you do not want that time counted.
- Sound depends on browser audio permissions. Visual completion always works.
- No note content is read or changed. No external services or accounts are needed.

## Preview
Open Preview.html in a browser. This runs the same timer and cat UI with separate browser-local progress, and does not install into RemNote.

## Development
The repository uses the official RemNote React plugin template (MIT).
Install Node.js, open a terminal in the repository folder, run `npm ci`, then `npm run dev`.
In RemNote → Settings → Plugins → Build → Develop from localhost, enter http://localhost:8080.
Keep the terminal running while developing. `npm run check-types` checks TypeScript; `npm run build` creates PluginZip.zip.

API references:
https://plugins.remnote.com/getting-started/quick_start_guide
https://plugins.remnote.com/advanced/widgets
https://plugins.remnote.com/api/classes/WindowNamespace

## Validation
TypeScript, production bundle validation, and timer/reward automated tests are run during packaging. Actual RemNote host placement/activation still needs verification in your account.

## Repository
https://github.com/minnahk03/purrmodoro

Version 0.0.2 corrects the repository URL for RemNote installation.
