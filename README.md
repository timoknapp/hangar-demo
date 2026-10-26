# Hangar demo — a software factory in public

This small task board is a live demonstration of [Hangar](https://github.com/timoknapp/Hangar), the self-hosted software factory for GitHub Copilot agents.
It starts with a read-only HTTP API and synthetic in-memory tasks; feature requests are processed as real GitHub issues and pull requests.
There is no database, login or external service.

## Run locally

Node.js 22 or later; no runtime packages or credentials are required.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm start
```

Open `http://127.0.0.1:3000` for the task list; `GET /api/tasks` returns the same synthetic data as JSON.
`GET /health` returns HTTP 200 with JSON `{"status":"ok"}` and `Cache-Control: no-store`.
The app binds to loopback by default and stores nothing between runs.

## What this demonstrates

- A bounded feature proceeds through verification and an independent critic to a draft PR; configured exact-head CI gates control Ready.
- An intentionally underspecified feature gives triage an opportunity to ask a real product question.
- A multi-capability request exercises split proposals and ordered child issues if the worker judges it oversized.
- A spec task is path-limited to a specification, not implementation.
- The maintainer reviews and merges; no agent merges a PR.

These are deliberately designed exercises, **not** production success-rate evidence.
Do not mix their outcomes into Hangar's private-reference reliability sample.
No result, review or CI status is staged: the issue and PR history are the evidence, including failures.
Demo triage uses conservative thresholds; the exact worker configuration and resulting PRs will be documented when the run is complete.
Learning and autonomous work generation stay off.

## Squad setup

Coordinator and team files were generated using `@bradygaster/squad-cli@1.0.0 init --preset default` from the [Squad project](https://github.com/bradygaster/squad).
The bootstrap omits optional Squad workflows, template resources and example MCP servers: Hangar owns this demo's queue, and the only active workflow is `Demo CI`.
The repository adds small project-specific intake and review notes under `.loop/`.
