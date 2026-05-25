# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run lint   # ESLint on app.js
npm test       # placeholder (no tests yet)
```

No build step — open `index.html` directly in a browser.

## Architecture

No framework, no bundler. Three files:

- `index.html` — structure. All DOM ids referenced in `app.js` are defined here.
- `style.css` — static styles only. Dark theme (`#1a1a2e` background). `.mode-label.break` switches color for break mode.
- `app.js` — all logic. Single flat module scope (no classes, no imports).

### State in app.js

Six mutable variables drive everything: `workMinutes`, `breakMinutes`, `mode` (`'work'`|`'break'`), `timeLeft` (seconds), `isRunning`, `interval` (setInterval handle). Settings changes call `resetBtn.click()` to reset derived state consistently.

### localStorage

Key: `pomodoro-log`. Stores an array of `{ date: 'YYYY-MM-DD', time: 'HH:MM', minutes: number }`. Only completed **work** sessions are logged (not breaks). `loadLogs()` filters to today's date on every read. `saveLog()` prunes entries older than 30 days on every write. All reads/writes are wrapped in `try/catch` for Safari private mode safety.

## Claude Code setup

- **Skill**: `.claude/skills/vanilla-web-review/` — project-level code review skill for vanilla HTML/CSS/JS
- **Agent**: `.claude/agents/code-reviewer.md` — invokes the vanilla-web-review skill to review project files
- **Hook**: `.claude/hooks/pre-commit.sh` — runs `npm run lint` and `npm test` before any `git commit` via `PreToolUse` Bash hook
